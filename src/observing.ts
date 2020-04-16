import { useEffect, useMemo } from "react";

import { EMPTY_ARR, IDENTIFIER_KEY, STORE_REGISTRY } from "./internals";
import {
  IContextManagerConstructor,
  IStringIndexed,
  TUpdateObserver,
  TUpdateSubscriber
} from "./types";
import { ContextManager } from "./ContextManager";

const shallowEqualObjects = require("shallow-equal").shallowEqualObjects;

/**
 * Initialize context manager once before tree mount and use memo.
 * Subscribe to adding/removing observers on mount/unmount.
 */
export function useLazyInitializeManager<T extends object>(managerConstructor: IContextManagerConstructor<T>, updateObserver: () => void): void {
  // Lazy init before observing with memo.
  useMemo(function (): void {
    // Only if registry is empty -> create new instance, remember its context and save it to registry.
    if (!managerConstructor.hasOwnProperty(IDENTIFIER_KEY) || !STORE_REGISTRY.MANAGERS.hasOwnProperty(managerConstructor[IDENTIFIER_KEY])) {
      const instance: ContextManager<T> = new managerConstructor();
      STORE_REGISTRY.STATES[managerConstructor[IDENTIFIER_KEY]] = instance.context;
      STORE_REGISTRY.MANAGERS[managerConstructor[IDENTIFIER_KEY]] = instance;
    }
  }, EMPTY_ARR);

  useEffect(() => {
    addObserver(managerConstructor, updateObserver);
    return () => removeObserver(managerConstructor, updateObserver);
  }, EMPTY_ARR);
}

/**
 * Add state changes observer.
 */
export function addObserver<T extends object>(managerConstructor: IContextManagerConstructor<T>, observer: TUpdateObserver): void {
  // Notify about provision, if it is first observer.
  if (STORE_REGISTRY.OBSERVERS[managerConstructor[IDENTIFIER_KEY]].size === 0) {
    // @ts-ignore protected and symbol properties.
    STORE_REGISTRY.MANAGERS[managerConstructor[IDENTIFIER_KEY]].onProvisionStarted();
  }

  STORE_REGISTRY.OBSERVERS[managerConstructor[IDENTIFIER_KEY]].add(observer);
}

/**
 * Remove state changes observer and kill instance if it is not singleton.
 */
export function removeObserver<T extends object>(managerConstructor: IContextManagerConstructor<T>, observer: TUpdateObserver): void {
  // Remove observer.
  STORE_REGISTRY.OBSERVERS[managerConstructor[IDENTIFIER_KEY]].delete(observer);

  if (STORE_REGISTRY.OBSERVERS[managerConstructor[IDENTIFIER_KEY]].size === 0) {
    const instance: ContextManager<T> | undefined = STORE_REGISTRY.MANAGERS[managerConstructor[IDENTIFIER_KEY]];

    if (!instance) {
      throw new Error("Could not find manager instance when removing last observer.");
    } else {
      // @ts-ignore protected.
      instance.onProvisionEnded();
      // @ts-ignore protected field, do not expose it for external usage.
      if (!managerConstructor.IS_SINGLETON) {
        delete STORE_REGISTRY.STATES[managerConstructor[IDENTIFIER_KEY]];
        delete STORE_REGISTRY.MANAGERS[managerConstructor[IDENTIFIER_KEY]];
      }
    }
  }
}

/**
 * Compare context manager state diff with shallow check + nested objects check.
 */
export function shouldObserversUpdate<T extends object>(manager: ContextManager<T>, nextContext: IStringIndexed<any>): boolean {
  const previousContext: IStringIndexed<any> = STORE_REGISTRY.STATES[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]];

  return Object
    .keys(nextContext)
    .some((key: string): boolean =>
      typeof nextContext[key] === "object"
        ? !shallowEqualObjects(nextContext[key], previousContext[key])
        : nextContext[key] !== previousContext[key]
    );
}

/**
 * Notify observers and check if update is needed.
 */
export function notifyObservers<T extends IStringIndexed<any>>(manager: ContextManager<T>, nextContext: T): void {
  STORE_REGISTRY.STATES[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]] = nextContext;
  STORE_REGISTRY.OBSERVERS[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]].forEach(((it: TUpdateObserver) => it()));
  STORE_REGISTRY.SUBSCRIBERS[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]].forEach(((it: TUpdateSubscriber<T>) => it(nextContext)));
}
