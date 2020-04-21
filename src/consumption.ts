import {
  ComponentType,
  createElement,
  MutableRefObject,
  useCallback, useContext,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import {
  IConsume,
  IConsumeDecorator,
  IContextManagerConstructor,
  IStringIndexed, MethodDescriptor,
  TConsumable,
  TTakeContextSelector,
  TUpdateSubscriber
} from "./types";
import { EMPTY_ARR, EMPTY_STRING, IDENTIFIER_KEY, MANAGER_REGEX, CONTEXT_STATES_REGISTRY } from "./internals";
import { ContextManager } from "./management";
import { subscribeToManager, unsubscribeFromManager } from "./registry";

import { log } from "./macroses/log.macro";

/**
 * Use manager hook with subscribed updates.
 * Same like common useContext hook, but has memo checks.
 */
export function useContextWithMemo<T extends object, D extends IContextManagerConstructor<T>>(
  managerConstructor: D,
  depsSelector: (context: T) => Array<any>
): D["prototype"]["context"] {
  const [ state, setState ] = useState(function() {
    return CONTEXT_STATES_REGISTRY[managerConstructor[IDENTIFIER_KEY]];
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
    subscribeToManager(managerConstructor, updateMemoState);
    return function() {
      unsubscribeFromManager(managerConstructor, updateMemoState);
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
    return useContext(managerConstructor.REACT_CONTEXT);
  }
}

/**
 * Function for consume wrappers that maps selectors and allows class components to consume store data.
 */
export function createManagersConsumer(target: ComponentType, sources: Array<TConsumable<any>>) {
  // todo: Should we warn if no alias and no selector provided?
  // todo: Should we warn if provided empty array-selector?
  for (const source of sources) {
    if (
      (typeof source !== "object" && typeof source !== "function")
      ||
      (
        typeof source === "object" && (
          (!source.from || typeof source.from !== "function" || !(source.from.prototype instanceof ContextManager)) ||
          (typeof source.as !== "undefined" && typeof source.as !== "string") ||
          typeof source.take === "object"
        )
      )
      ||
      typeof source === "function" && !(source.prototype instanceof ContextManager)
    ) {
      throw new TypeError("Wrong context-consume parameter supplied.");
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

  Consumer.displayName = "DS.Consumer";

  log.info("Created consumer:", Consumer.displayName);

  return Consumer;
}

/**
 * Decorator factory.
 * Consumes context from context manager.
 * Observes changes and uses default react Provider.
 *
 * todo: Stricter component typing.
 */
export const Consume: IConsumeDecorator = function (sources: Array<TConsumable<any>>): any {
  // Higher order decorator to reserve params.
  return function(classOrDescriptor: ComponentType) {
    // Legacy decorators and ES proposal.
    if (typeof classOrDescriptor === "function") {
      log.info(`Creating legacy consume decorator for ${sources.length} sources. Target:`, classOrDescriptor.name);
      return hoistNonReactStatics(createManagersConsumer(classOrDescriptor, sources), classOrDescriptor);
    } else {
      (classOrDescriptor as MethodDescriptor).finisher = function (wrappedComponent: ComponentType) {
        log.info(`Creating proposal consume decorator for ${sources.length} sources. Target:`, wrappedComponent.name);
        return hoistNonReactStatics(createManagersConsumer(wrappedComponent, sources), wrappedComponent);
      } as any;

      return classOrDescriptor;
    }
  };
} as any;

/**
 * HOC alias for @Consume.
 */
export const withConsumption: IConsume = Consume as IConsume;

