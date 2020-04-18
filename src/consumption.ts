import {
  ComponentType,
  createElement,
  MutableRefObject,
  useCallback, useContext,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { default as hoistNonReactStatics } from "hoist-non-react-statics";

import {
  ClassDescriptor,
  IConsume,
  IConsumeDecorator,
  IContextManagerConstructor,
  IStringIndexed,
  TConsumable,
  TTakeContextSelector,
  TUpdateSubscriber
} from "./types";
import { EMPTY_ARR, EMPTY_STRING, IDENTIFIER_KEY, MANAGER_REGEX } from "./internals";
import { ContextManager } from "./ContextManager";
import { addManagerSubscriber, removeManagerSubscriber, STORE_REGISTRY } from "./registry";

declare const IS_DEV: boolean;

/**
 * Use manager hook with subscribed updates.
 * Same like common useContext hook, but has memo checks.
 */
export function useContextWithMemo<T extends object, D extends IContextManagerConstructor<T>>(
  managerConstructor: D,
  depsSelector: (context: T) => Array<any>
): D["prototype"]["context"] {
  const [ state, setState ] = useState(function() {
    return STORE_REGISTRY.CONTEXT_STATES[managerConstructor[IDENTIFIER_KEY]];
  });
  const observed: MutableRefObject<Array<any>> = useRef(depsSelector(state));

  const updateMemoState: TUpdateSubscriber<T> = useCallback(function(nextContext: T): void {
    // Calculate changes like react lib does and fire change only after update.
    const nextObserved = depsSelector(nextContext);

    for (let it = 0; it < nextObserved.length; it ++) {
      if (observed.current[it] !== nextObserved[it]) {
        observed.current = nextObserved;
        setState(nextContext);
        return;
      }
    }
  }, EMPTY_ARR);

  useLayoutEffect(function() {
    addManagerSubscriber(managerConstructor, updateMemoState);
    return function() {
      removeManagerSubscriber(managerConstructor, updateMemoState);
    };
  });

  return state;
}

/**
 * Use manager hook, higher order wrapper for useContext.
 */
export function useManager<T extends object, D extends IContextManagerConstructor<T>>(
  managerConstructor: D,
  depsSelector?: (context: D["prototype"]["context"]) => Array<any>
): D["prototype"]["context"] {
  if (depsSelector) {
    return useContextWithMemo(managerConstructor, depsSelector);
  } else {
    return useContext(managerConstructor.getContextType());
  }
}

/**
 * Function for consume wrappers that maps selectors and allows class components to consume store data.
 */
export function createManagersConsumer(target: ComponentType, sources: Array<TConsumable<any>>) {
  // todo: Should we warn if no alias and no selector provided?
  // todo: Should we warn if provided empty array-selector?
  /**
   * Extended assistance for DEV bundle.
   */
  if (IS_DEV) {
    // Warn about too big consume count.
    if (sources.length > 5) {
      console.warn("Seems like your component tries to consume more than 5 stores at once, more than 5 can" +
        " lead to slower rendering for big components. Separate consuming by using multiple Consume decorators/hocs " +
        "for one component or review your components structure.",
      `Source: '${target.name}'.`
      );
    }

    // Validate input sources.
    for (const source of sources) {
      if (typeof source === "object") {
        if (!source.from || typeof source.from !== "function") {
          throw new TypeError(
            "Specified 'from' selector should point to correct context manager. Supplied type: " +
            `'${typeof source.from}'. Check '${target.name}' component.`
          );
        } else if (!(source.from.prototype instanceof ContextManager)) {
          throw new TypeError(
            "Specified consume target should inherit 'ContextManager', seems like you have forgotten to extend your " +
            `manager class. Wrong parameter: '${source.from.name || "anonymous."}'. Check '${target.name}' component.`);
        }

        if (typeof source.as !== "undefined" && typeof source.as !== "string") {
          throw new TypeError(
            "Specified 'as' param should point to string component property key. Supplied type: " +
            `'${typeof source.as}'. Check '${target.name}' component.`
          );
        }

        if (source.take === null) {
          throw new TypeError(
            "Specified 'take' param should be a valid selector. Selectors can be functional, string or array. " +
            `Supplied type: '${typeof source}'. Check '${target.name}' component.`
          );
        }
      } else if (typeof source === "function") {
        if (!(source.prototype instanceof ContextManager)) {
          throw new TypeError(
            "Specified consume target should inherit 'ContextManager', seems like you forgot to extend your manager " +
            `class. Wrong parameter: '${source.name || "anonymous function"}'. Check '${target.name}' component.`);
        }
      } else {
        throw new TypeError(
          "Specified consume source is not selector or context manager." +
          `Supplied type: '${typeof source}'. Check '${target.name}' component.`
        );
      }
    }
  } else {
    for (const source of sources) {
      if (
        (typeof source !== "object" && typeof source !== "function")
        ||
        (
          typeof source === "object" && (
            (!source.from || typeof source.from !== "function" || !(source.from.prototype instanceof ContextManager)) ||
            (typeof source.as !== "undefined" && typeof source.as !== "string") ||
            source.take === null
          )
        )
        ||
        typeof source === "function" && !(source.prototype instanceof ContextManager)
      ) {
        throw new TypeError("Wrong context-consume parameter supplied.");
      }
    }
  }

  /**
   * Create selectors once to prevent checks on every render.
   * Optimization on resolving + additional checks.
   */
  const selectors: Array<(accumulator: IStringIndexed<any>) => void> = new Array(sources.length);

  for (let it = 0; it < selectors.length; it ++) {
    const source: TConsumable<any> = sources[it];

    // Is context manager.
    if (source.prototype instanceof ContextManager) {
      selectors[it] = (accumulator: IStringIndexed<any>) => Object.assign(accumulator, useManager(source));
    } else {
      const take: TTakeContextSelector<any> = source.take;
      const alias: string | undefined = source.as;

      // No selector, only alias.
      if (take === undefined) {
        if (alias) {
          selectors[it] = function(accumulator: IStringIndexed<any>) {
            accumulator[source.as] = useManager(source.from);
          };
        } else {
          selectors[it] = function(accumulator: IStringIndexed<any>) {
            Object.assign(accumulator, useManager(source.from));
          };
        }
      } else if (Array.isArray(take)) {
        // Selected array of needed props, filter only needed and alias it if 'as' is supplied.
        // Here we can automatically use memo parameter.
        const memoCheck = function(current: IStringIndexed<any>) {
          return (take as Array<string>).map(function(it: string) {
            return current[it];
          });
        };

        if (alias) {
          selectors[it] = function(accumulator: IStringIndexed<any>) {
            const context: IStringIndexed<any> = useManager(source.from, memoCheck);

            accumulator[alias] = (take as Array<string>).reduce((a: IStringIndexed<any>, e: string) =>
              (a[e] = context[e], a), {});
          };
        } else {
          selectors[it] = function(accumulator: IStringIndexed<any>) {
            const context: IStringIndexed<any> = useManager(source.from, memoCheck);

            Object.assign(accumulator, (take as Array<string>).reduce(function(a: IStringIndexed<any>, e: string) {
              return (a[e] = context[e], a);
            }, {}));
          };
        }
      } else if (typeof take === "function") {
        // Supplied functional selector, return object with needed props like redux does. Alias if 'as' is supplied.
        const memoCheck = function(current: IStringIndexed<any>) {
          return Object.values(take(current));
        };

        if (alias) {
          selectors[it] = function(accumulator: IStringIndexed<any>) {
            accumulator[alias] = take(useManager(source.from, memoCheck));
          };
        } else {
          selectors[it] = function(accumulator: IStringIndexed<any>) {
            Object.assign(accumulator, take(useManager(source.from, memoCheck)));
          };
        }
      } else if (typeof take === "string") {
        // Pick only selected key prop. Using memo-selector here.
        const memoCheck = function(current: IStringIndexed<any>) {
          return [ current[take] ];
        };

        if (alias) {
          selectors[it] = function(accumulator: IStringIndexed<any>) {
            accumulator[alias] = useManager(source.from, memoCheck)[take];
          };
        } else {
          selectors[it] = function(accumulator: IStringIndexed<any>) {
            accumulator[take] = useManager(source.from, memoCheck)[take] ;
          };
        }
      }
    }
  }

  // HOC component to pick props and provide needed/selected.
  function Consumer(ownProps: object) {
    const consumed: IStringIndexed<any> = {};

    // todo: Array.reduce or for-of?
    for (const selector of selectors) {
      selector(consumed);
    }

    return createElement(target as any, Object.assign(consumed, ownProps));
  }

  if (IS_DEV) {
    Consumer.displayName = `Dreamstate.Consumer.[${sources.map((it: TConsumable<any>) =>
      it.prototype instanceof ContextManager
        ? it.name.replace(MANAGER_REGEX, EMPTY_STRING)
        : `${it.from.name.replace(MANAGER_REGEX, EMPTY_STRING)}{${it.take}}`)}]`;
  } else {
    Consumer.displayName = "DS.Consumer";
  }

  return Consumer;
}

/**
 * Decorator factory.
 * Consumes context from context manager.
 * Observes changes and uses default react Provider.
 */
export const Consume: IConsumeDecorator = function(...sources: Array<TConsumable<any>>): any {
  // Higher order decorator to reserve params.
  return function(classOrDescriptor: ComponentType) {
    // Support legacy and proposal decorators.
    return ((typeof classOrDescriptor === "function"))
      ? hoistNonReactStatics(createManagersConsumer(classOrDescriptor, sources), classOrDescriptor)
      : ({
        ...(classOrDescriptor as ClassDescriptor),
        finisher: (wrappedComponent: ComponentType) =>
          hoistNonReactStatics(createManagersConsumer(wrappedComponent, sources), wrappedComponent)
      });
  };
} as any;

/**
 * HOC alias for @Consume.
 */
export const withConsumption: IConsume = Consume as IConsume;
