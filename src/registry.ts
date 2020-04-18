import { IContextManagerConstructor, IStringIndexed, TUpdateObserver, TUpdateSubscriber } from "./types";
import { ContextManager } from "./ContextManager";
import { IDENTIFIER_KEY } from "./internals";

export const STORE_REGISTRY: {
  MANAGERS: IStringIndexed<ContextManager<any>>;
  CONTEXT_OBSERVERS: IStringIndexed<Set<TUpdateObserver>>;
  CONTEXT_SUBSCRIBERS: IStringIndexed<Set<TUpdateSubscriber<any>>>;
  STATES: IStringIndexed<any>;
} = {
  /**
   * Registry of managers instances for global references and better management.
   * Used for current/singleton instances reference.
   */
  MANAGERS: {},
  /**
   * Registry for context observers.
   * Same state across all providers with minimal actions.
   */
  CONTEXT_OBSERVERS: {},
  /**
   * Registry for context subscribers.
   * Subscribers not necessarily related to react
   */
  CONTEXT_SUBSCRIBERS: {},
  STATES: {},
};

/**
 * Register context manager entry.
 */
export function registerManager<T extends object>(
  managerConstructor: IContextManagerConstructor<T>,
) {
  // Only if registry is empty -> create new instance, remember its context and save it to registry.
  if (
    !Object.prototype.hasOwnProperty.call(managerConstructor, IDENTIFIER_KEY) ||
    !Object.prototype.hasOwnProperty.call(STORE_REGISTRY.MANAGERS, managerConstructor[IDENTIFIER_KEY])
  ) {
    const instance: ContextManager<T> = new managerConstructor();

    STORE_REGISTRY.STATES[managerConstructor[IDENTIFIER_KEY]] = instance.context;
    STORE_REGISTRY.MANAGERS[managerConstructor[IDENTIFIER_KEY]] = instance;
  }
}

/**
 * Add state changes observer.
 */
export function addManagerObserverToRegistry<T extends object>(
  managerConstructor: IContextManagerConstructor<T>,
  observer: TUpdateObserver
): void {
  // Notify about provision, if it is first observer.
  if (STORE_REGISTRY.CONTEXT_OBSERVERS[managerConstructor[IDENTIFIER_KEY]].size === 0) {
    // @ts-ignore protected and symbol properties.
    STORE_REGISTRY.MANAGERS[managerConstructor[IDENTIFIER_KEY]].onProvisionStarted();
  }

  STORE_REGISTRY.CONTEXT_OBSERVERS[managerConstructor[IDENTIFIER_KEY]].add(observer);
}

/**
 * Remove state changes observer and kill instance if it is not singleton.
 */
export function removeManagerObserverFromRegistry<T extends object>(
  managerConstructor: IContextManagerConstructor<T>,
  observer: TUpdateObserver
): void {
  // Remove observer.
  STORE_REGISTRY.CONTEXT_OBSERVERS[managerConstructor[IDENTIFIER_KEY]].delete(observer);

  if (STORE_REGISTRY.CONTEXT_OBSERVERS[managerConstructor[IDENTIFIER_KEY]].size === 0) {
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

export function addManagerSubscriber<T extends object, D extends IContextManagerConstructor<T>>(
  managerConstructor: D,
  subscriber: TUpdateSubscriber<T>,
  loadCurrent: boolean = false
): void {
  STORE_REGISTRY.CONTEXT_SUBSCRIBERS[managerConstructor[IDENTIFIER_KEY]].add(subscriber);

  if (loadCurrent) {
    subscriber(STORE_REGISTRY.STATES[managerConstructor[IDENTIFIER_KEY]]);
  }
}

export function removeManagerSubscriber<T extends object, D extends IContextManagerConstructor<T>>(
  managerConstructor: D,
  subscriber: TUpdateSubscriber<T>
): void {
  STORE_REGISTRY.CONTEXT_SUBSCRIBERS[managerConstructor[IDENTIFIER_KEY]].delete(subscriber);
}