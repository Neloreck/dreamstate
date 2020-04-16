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
import { EMPTY_ARR, EMPTY_STRING, IDENTIFIER_KEY, MANAGER_REGEX, STORE_REGISTRY } from "./internals";
import { ContextManager } from "./ContextManager";

declare const IS_DEV: boolean;

// Todo: Lazy check and strategy patter here.
export function createManagersConsumer(target: ComponentType, sources: Array<TConsumable<any>>) {
  // Only dev assistance with detailed messages.
  if (IS_DEV) {
    // Warn about too big consume count.
    if (sources.length > 5) {
      console.warn(
        "Seems like your component tries to consume more than 5 stores at once, more than 5 can lead to slower rendering for big components." +
        " Separate consuming by using multiple Consume decorators/hocs for one component or review your components structure.",
        `Source: '${target.name}'.`
      );
    }

    // Validate input sources.
    for (const source of sources) {
      if (typeof source === "object") {
        if (!source.from || typeof source.from !== "function") {
          throw new TypeError(`Specified 'from' selector should point to correct context manager. Supplied type: '${typeof source.from}'. Check '${target.name}' component.`);
        } else if (!(source.from.prototype instanceof ContextManager)) {
          throw new TypeError(`Specified consume target should inherit 'ContextManager', seems like you have forgotten to extend your manager class. Wrong parameter: '${source.from.name || "anonymous function."}'. Check '${target.name}' component.`);
        }

        if (typeof source.as !== "undefined" && typeof source.as !== "string") {
          throw new TypeError(`Specified 'as' param should point to string component property key. Supplied type: '${typeof source.as}'. Check '${target.name}' component.`);
        }

        if (source.take === null) {
          throw new TypeError(`Specified 'take' param should be a valid selector. Selectors can be functional, string, array or object. Supplied type: '${typeof source}'. Check '${target.name}' component.`);
        }
      } else if (typeof source === "function") {
        if (!(source.prototype instanceof ContextManager)) {
          throw new TypeError(`Specified consume target should inherit 'ContextManager', seems like you have forgotten to extend your manager class. Wrong parameter: '${source.name || "anonymous function"}'. Check '${target.name}' component.`);
        }
      } else {
        throw new TypeError(`Specified consume source is not selector or context manager. Supplied type: '${typeof source}'. Check '${target.name}' component.`);
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

  // HOC component to pick props and provide needed/selected.
  // todo: useContext will update HOC every time, it should not be expensive but implement check for only needed props if react will add it.
  function Consumer(ownProps: object) {

    let consumed: IStringIndexed<any> = {};

    for (const source of sources) {

      if (source.prototype instanceof ContextManager) {
        Object.assign(consumed, useManager(source))
      } else {

        const selector: TTakeContextSelector<any> = source.take;
        const context: IStringIndexed<any> = useManager(source.from);

        // No selector, probably want to make alias for class component.
        if (selector === undefined) {
          if (typeof source.as !== "undefined") {
            consumed[source.as] = context;
          } else {
            Object.assign(consumed, context);
          }
          // Selected array of needed props, filter only needed and alias if 'as' is supplied.
        } else if (Array.isArray(selector)) {
          const pickedData = (selector as Array<string>).reduce((a: IStringIndexed<any>, e: string) => (a[e] = context[e], a), {});
          Object.assign(consumed, source.as ? { [source.as]: pickedData } : pickedData);
          // Supplied functional selector, return object with needed props like redux does. Alias if 'as' is supplied.
        } else if (typeof selector === "function") {
          Object.assign(consumed, source.as ? { [source.as]:  selector(context) } :  selector(context));
          // todo:
        } else if (typeof selector === "object") {
          const pickedData = selector.take ? selector.take.reduce((a: IStringIndexed<any>, e: string) => (a[e] = context[selector.from][e], a), {}) : context[selector.from];

          if (typeof source.as === "undefined") {
            Object.assign(consumed, pickedData);
          } else {
            consumed[source.as] = pickedData;
          }
          // Provided string selector, only one prop is needed. Alias if 'as' is supplied.
        } else if (typeof selector === "string") {
          consumed[typeof source.as === "undefined" ? selector : source.as] = context[selector] ;
        }
      }
    }

    return createElement(target as any, Object.assign(consumed, ownProps));
  }

  if (IS_DEV) {
    Consumer.displayName = `Dreamstate.Consumer.[${sources.map((it: TConsumable<any>) => it.prototype instanceof ContextManager
      ?  it.name.replace(MANAGER_REGEX, EMPTY_STRING)
      : `${it.from.name.replace(MANAGER_REGEX, EMPTY_STRING)}{${it.take}}`)}]`;
  } else {
    Consumer.displayName = "DS.Consumer";
  }

  return Consumer;
}

export function useContextWithMemo<T extends object, D extends IContextManagerConstructor<T>>(
  managerConstructor: D,
  depsSelector: (context: T) => Array<any>
): D["prototype"]["context"] {
  const [ state, setState ] = useState(function () {
    return STORE_REGISTRY.STATES[managerConstructor[IDENTIFIER_KEY]];
  });
  const observed: MutableRefObject<Array<any>> = useRef(depsSelector(state));

  const updateMemoState: TUpdateSubscriber<T> = useCallback(function (nextContext: T): void {
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

  useLayoutEffect(function () {
    STORE_REGISTRY.SUBSCRIBERS[managerConstructor[IDENTIFIER_KEY]].add(updateMemoState);
    return function () {
      STORE_REGISTRY.SUBSCRIBERS[managerConstructor[IDENTIFIER_KEY]].delete(updateMemoState);
    }
  });

  return state;
}
/**
 * Exported API.
 */

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
 * Decorator factory.
 * Consumes context from context manager.
 * Observes changes and uses default react Provider.
 */
export const Consume: IConsumeDecorator = function (...sources: Array<TConsumable<any>>): any {
  // Higher order decorator to reserve params.
  return function(classOrDescriptor: ComponentType) {
    // Support legacy and proposal decorators.
    return ((typeof classOrDescriptor === 'function'))
      ? hoistNonReactStatics(createManagersConsumer(classOrDescriptor, sources), classOrDescriptor)
      : ({
        ...(classOrDescriptor as ClassDescriptor),
        finisher: (wrappedComponent: ComponentType) => hoistNonReactStatics(createManagersConsumer(wrappedComponent, sources), wrappedComponent)
      });
  };
} as any;

/**
 * HOC alias for @Consume.
 */
export const withConsumption: IConsume = Consume as IConsume;
