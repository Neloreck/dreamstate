import { ComponentType, createElement, memo, ReactElement, useCallback, useEffect, useMemo, useState } from "react";

import { EMPTY_ARR, EMPTY_STRING, IDENTIFIER_KEY, MANAGER_REGEX, MUTABLE_KEY } from "./internals";
import {
  IContextManagerConstructor,
  IStringIndexed, TAnyContextManagerConstructor, TConsumable,
  TUpdateObserver, TUpdateSubscriber,
} from "./types";
import { ContextManager } from "./ContextManager";
import {
  addManagerObserverToRegistry,
  registerManager,
  removeManagerObserverFromRegistry,
  STORE_REGISTRY
} from "./registry";

const shallowEqualObjects = require("shallow-equal").shallowEqualObjects;

declare const IS_DEV: boolean;

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
        sources[current].getContextType().Provider,
        { value: STORE_REGISTRY.CONTEXT_STATES[sources[current][IDENTIFIER_KEY]] },
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

  if (IS_DEV) {
    Observer.displayName = `Dreamstate.Observer.[${
      sources.map((it: TConsumable<any>) => it.name.replace(MANAGER_REGEX, EMPTY_STRING))
    }]`;
  } else {
    Observer.displayName = "DS.Observer";
  }

  // Hoc helper for decorated components to prevent odd renders.
  return memo(Observer) as any;
}

/**
 * Compare context manager state diff with shallow check + nested objects check.
 */
export function shouldObserversUpdate<T extends object>(
  manager: ContextManager<T>, nextContext: IStringIndexed<any>
): boolean {
  const previousContext: IStringIndexed<any> =
    STORE_REGISTRY.CONTEXT_STATES[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]];

  return Object
    .keys(nextContext)
    .some(function (key: string): boolean {
      const nextValue: any = nextContext[key];

      /**
       * Shallow check for mutable objects created by library.
       * Optimization for sub-states to prevent pollution of context and improve performance.
       * We cannot guess about each object because it is (1) not obvious, (2) can be unwanted and (3) will not work for
       * some objects like native MediaStream/MediaStreamTrack.
       */
      return nextValue !== null && typeof nextValue === "object" && nextValue[MUTABLE_KEY]
        ? !shallowEqualObjects(nextValue, previousContext[key])
        : nextValue !== previousContext[key];
    });
}

/**
 * Notify observers and check if update is needed.
 */
export function notifyObservers<T extends IStringIndexed<any>>(
  manager: ContextManager<T>,
  nextContext: T
): void {
  STORE_REGISTRY.CONTEXT_STATES[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]] = nextContext;
  STORE_REGISTRY.CONTEXT_OBSERVERS[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]]
    .forEach(function(it: TUpdateObserver) { it(); });
  /**
   * Async execution for subscribers.
   * There will be small amount of observers that work by the rules, but we cannot tell anything about subs.
   * Subscribers should not block code there with CPU usage/unhandled exceptions.
   */
  STORE_REGISTRY.CONTEXT_SUBSCRIBERS[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]].
    forEach(function(it: TUpdateSubscriber<T>) {
      setTimeout(function () {
        it(nextContext);
      });
    });
}
