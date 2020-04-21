import { ComponentType, createElement, memo, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { shallowEqualObjects } from "shallow-equal";

import {
  EMPTY_ARR,
  IDENTIFIER_KEY,
  NESTED_STORE_KEY,
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY
} from "./internals";
import {
  IContextManagerConstructor,
  IStringIndexed,
  TAnyContextManagerConstructor,
  TUpdateObserver,
  TUpdateSubscriber,
} from "./types";
import { ContextManager } from "./management";
import {
  addManagerObserverToRegistry,
  registerManager,
  removeManagerObserverFromRegistry,
} from "./registry";

import { log } from "./macroses/log.macro";

/**
 * Initialize context manager once before tree mount and use memo.
 * Subscribe to adding/removing observers on mount/unmount.
 */
export function useLazyInitializeManager<T extends object>(
  managerConstructor: IContextManagerConstructor<T>, updateObserver: () => void
): void {
  useMemo(function (): void { registerManager(managerConstructor); }, EMPTY_ARR);

  useEffect(() => {
    addManagerObserverToRegistry(managerConstructor, updateObserver);
    return () => removeManagerObserverFromRegistry(managerConstructor, updateObserver);
  }, EMPTY_ARR);
}

/**
 * Subtree provider as global scope helper.
 */
export function provideSubTree(
  current: number,
  bottom: ReactElement,
  sources: Array<TAnyContextManagerConstructor>
): ReactElement {
  return (
    current >= sources.length
      ? bottom
      : createElement(
        sources[current].REACT_CONTEXT.Provider,
        { value: CONTEXT_STATES_REGISTRY[sources[current][IDENTIFIER_KEY]] },
        provideSubTree(current + 1, bottom, sources)
      )
  );
}

/**
 * Utility method for observers creation.
 */
export function createManagersObserver(
  children: ComponentType | null,
  sources: Array<TAnyContextManagerConstructor>
) {
  // Create observer component that will handle observing.
  function Observer(props: IStringIndexed<any>): ReactElement {
    // Update providers subtree utility.
    const [ , updateState ] = useState();
    const updateProviders = useCallback(function () { updateState({}); }, EMPTY_ARR);

    // Subscribe to tree updater and lazily get first context value.
    for (let it = 0; it < sources.length; it ++) {
      useLazyInitializeManager(sources[it], updateProviders);
    }

    return provideSubTree(0, (children ? createElement(children, props) : props.children), sources);
  }

  Observer.displayName = "DS.Observer";

  log.info("Context manager observer created:", Observer.displayName);

  // Hoc helper for decorated components to prevent odd renders.
  return memo(Observer) as any;
}

/**
 * Compare context manager state diff with shallow check + nested objects check.
 */
export function shouldObserversUpdate<T extends object>(
  previousContext: IStringIndexed<any>, nextContext: IStringIndexed<any>
): boolean {
  // If previous context is registered and current supplied.
  return !previousContext || Object
    .keys(nextContext)
    .some(function (key: string): boolean {
      const nextValue: any = nextContext[key];

      /**
       * Shallow check for mutable objects created by library.
       * Optimization for sub-states to prevent pollution of context and improve performance.
       * We cannot guess about each object because it is (1) not obvious, (2) can be unwanted and (3) will not work for
       * some objects like native MediaStream/MediaStreamTrack.
       *
       * todo: Check if one object is mutable, but next is not and print warnings.
       */
      return nextValue !== null && typeof nextValue === "object" && nextValue[NESTED_STORE_KEY]
        ? !shallowEqualObjects(nextValue, previousContext[key])
        : nextValue !== previousContext[key];
    });
}

/**
 * Notify observers and check if update is needed.
 */
export function notifyObservers<T extends IStringIndexed<any>>(manager: ContextManager<T>): void {
  const nextContext: T = manager.context;

  log.info(
    "Context manager notify observers and subscribers:",
    manager.constructor.name,
    CONTEXT_OBSERVERS_REGISTRY[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]].size,
    CONTEXT_SUBSCRIBERS_REGISTRY[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]].size
  );

  CONTEXT_STATES_REGISTRY[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]] = nextContext;
  CONTEXT_OBSERVERS_REGISTRY[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]]
    .forEach(function(it: TUpdateObserver) { it(); });
  /**
   * Async execution for subscribers.
   * There will be small amount of observers that work by the rules, but we cannot tell anything about subs.
   * Subscribers should not block code there with CPU usage/unhandled exceptions.
   */
  CONTEXT_SUBSCRIBERS_REGISTRY[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]].
    forEach(function(it: TUpdateSubscriber<T>) {
      setTimeout(function () {
        it(nextContext);
      });
    });
}
