import {
  ComponentType,
  createElement,
  MutableRefObject,
  ReactElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import {
  IConsume,
  IConsumeDecorator,
  IContextManagerConstructor,
  IStringIndexed,
  TConsumable,
  TTakeContextSelector,
  TUpdateSubscriber
} from "./types";
import { EMPTY_ARR, IDENTIFIER_KEY, CONTEXT_STATES_REGISTRY } from "./internals";
import { ContextManager } from "./management";
import { subscribeToManager, unsubscribeFromManager } from "./registry";
import { createClassWrapDecorator } from "./polyfills/decorate";

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
 * todo: Should we warn if no alias and no selector provided?
 */
export function createManagersConsumer(target: ComponentType, sources: Array<TConsumable<any>>) {
  for (const source of sources) {
    if (
      // Is null.
      source === null
      ||
      // Not prototype and not selector
      (typeof source !== "object" && typeof source !== "function")
      ||
      // Validate selector object.
      (
        typeof source === "object" && (
          // Should have correct 'from' selector.
          (!source.from || typeof source.from !== "function" || !(source.from.prototype instanceof ContextManager)) ||
          // Should have correct alias or undefined.
          (typeof source.as !== "undefined" && typeof source.as !== "string") ||
          // Should have anything for key-mapping except objects and nulls.
          typeof source.take === "object"
        )
      )
      ||
      // Validate provided constructor.
      typeof source === "function" && !(source.prototype instanceof ContextManager)
    ) {
      throw new TypeError("Wrong context-consume parameter supplied.");
    }
  }

  /**
   * Create selectors once to prevent checks on every render.
   * Optimization on resolving + additional checks.
   */
  const mutators: Array<(accumulator: IStringIndexed<any>) => IStringIndexed<any>> = new Array(sources.length);

  for (let it = 0; it < mutators.length; it ++) {
    const source: TConsumable<any> = sources[it];

    // Is context manager.
    if (source.prototype instanceof ContextManager) {
      mutators[it] = (accumulator: IStringIndexed<any>) => Object.assign(accumulator, useManager(source));
    } else {
      const take: TTakeContextSelector<any> = source.take;
      const alias: string | undefined = source.as;

      // No selector, only alias.
      if (take === undefined) {
        if (alias) {
          mutators[it] = function(accumulator: IStringIndexed<any>) {
            accumulator[source.as] = useManager(source.from);
            return accumulator;
          };
        } else {
          mutators[it] = function(accumulator: IStringIndexed<any>) {
            return Object.assign(accumulator, useManager(source.from));
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
          mutators[it] = function(accumulator: IStringIndexed<any>) {
            const context: IStringIndexed<any> = useManager(source.from, memoCheck);

            accumulator[alias] = (take as Array<string>).reduce((a: IStringIndexed<any>, e: string) =>
              (a[e] = context[e], a), {});

            return accumulator;
          };
        } else {
          mutators[it] = function(accumulator: IStringIndexed<any>) {
            const context: IStringIndexed<any> = useManager(source.from, memoCheck);

            return Object.assign(
              accumulator,
              (take as Array<string>).reduce(function(a: IStringIndexed<any>, e: string) {
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
          mutators[it] = function(accumulator: IStringIndexed<any>) {
            accumulator[alias] = take(useManager(source.from, memoCheck));
            return accumulator;
          };
        } else {
          mutators[it] = function(accumulator: IStringIndexed<any>) {
            return Object.assign(accumulator, take(useManager(source.from, memoCheck)));
          };
        }
        // Fallback to indexing. Strings, boolean, numbers, symbols etc.
      } else {
        // Pick only selected key prop. Using memo-selector here.
        const memoCheck = function(current: IStringIndexed<any>) {
          return [ current[take as any] ];
        };

        if (alias) {
          mutators[it] = function(accumulator: IStringIndexed<any>) {
            accumulator[alias as any] = useManager(source.from, memoCheck)[take];
            return accumulator;
          };
        } else {
          mutators[it] = function(accumulator: IStringIndexed<any>) {
            accumulator[take as any] = useManager(source.from, memoCheck)[take] ;
            return accumulator;
          };
        }
      }
    }
  }

  // HOC component to pick props and provide needed/selected.
  function Consumer(ownProps: object): ReactElement {
    return createElement(
      target,
      Object.assign(
        mutators.reduce(
          function (acc: IStringIndexed<any>, mutator: (acc: IStringIndexed<any>) => IStringIndexed<any>) {
            return mutator(acc);
          }, {}),
        ownProps
      )
    );
  }

  Consumer.displayName = "DS.Consumer";

  return Consumer;
}

/**
 * Decorator factory.
 * Consumes context from context manager.
 * Observes changes and uses default react Provider.
 *
 * todo: Stricter component typing.
 */
export const Consume: IConsumeDecorator = function(
  sources: Array<TConsumable<any>>
): ClassDecorator {
  return createClassWrapDecorator(function (targetClass) {
    return hoistNonReactStatics(createManagersConsumer(targetClass as any, sources), targetClass as ComponentType);
  });
};

/**
 * HOC alias for @Consume.
 */
export const withConsumption: IConsume = Consume as IConsume;

