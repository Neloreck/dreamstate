import {
  IContextManagerConstructor,
  IStringIndexed, TAnyContextManagerConstructor,
  TUpdateObserver,
  TUpdateSubscriber
} from "./types";
import { ContextManager } from "./management";
import { IDENTIFIER_KEY, SIGNAL_LISTENER_KEY } from "./internals";
import { subscribeToSignals, unsubscribeFromSignals } from "./signals";

export const CONTEXT_MANAGERS_REGISTRY: IStringIndexed<ContextManager<any>> = {};
export const CONTEXT_OBSERVERS_REGISTRY: IStringIndexed<Set<TUpdateObserver>> = {};
export const CONTEXT_SUBSCRIBERS_REGISTRY: IStringIndexed<Set<TUpdateSubscriber<any>>> = {};
export const CONTEXT_STATES_REGISTRY: IStringIndexed<any> = {};

/**
 * Register context manager entry.
 */
export function registerManager<T extends object>(
  managerConstructor: IContextManagerConstructor<T>,
): void {
  // Only if registry is empty -> create new instance, remember its context and save it to registry.
  if (
    !Object.prototype.hasOwnProperty.call(managerConstructor, IDENTIFIER_KEY) ||
    !Object.prototype.hasOwnProperty.call(CONTEXT_MANAGERS_REGISTRY, managerConstructor[IDENTIFIER_KEY])
  ) {
    const instance: ContextManager<T> = new managerConstructor();

    CONTEXT_STATES_REGISTRY[managerConstructor[IDENTIFIER_KEY]] = instance.context;
    CONTEXT_MANAGERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]] = instance;

    subscribeToSignals(instance[SIGNAL_LISTENER_KEY]);
  }
}

export function unRegisterManager<T extends object>(
  managerConstructor: IContextManagerConstructor<T>,
): void {
  const instance: ContextManager<T> | undefined = CONTEXT_MANAGERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]];

  if (!instance) {
    throw new Error("Could not find manager instance when unregister it.");
  } else {
    instance["onProvisionEnded"]();
    // @ts-ignore
    if (!managerConstructor["IS_SINGLE"]) {
      unsubscribeFromSignals(instance[SIGNAL_LISTENER_KEY]);

      delete CONTEXT_STATES_REGISTRY[managerConstructor[IDENTIFIER_KEY]];
      delete CONTEXT_MANAGERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]];
    }
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
  if (CONTEXT_OBSERVERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]].size === 0) {
    CONTEXT_MANAGERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]]["onProvisionStarted"]();
  }

  CONTEXT_OBSERVERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]].add(observer);
}

/**
 * Remove state changes observer and kill instance if it is not singleton.
 */
export function removeManagerObserverFromRegistry<T extends object>(
  managerConstructor: IContextManagerConstructor<T>,
  observer: TUpdateObserver
): void {
  // Remove observer.
  CONTEXT_OBSERVERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]].delete(observer);

  if (CONTEXT_OBSERVERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]].size === 0) {
    unRegisterManager(managerConstructor);
  }
}

/**
 * Subscribe to manager updates/changes.
 * Callback will be fired after each state update.
 */
export function subscribeToManager<T extends object, D extends IContextManagerConstructor<T>>(
  managerConstructor: D,
  subscriber: TUpdateSubscriber<T>,
  loadCurrent: boolean = false
): void {
  CONTEXT_SUBSCRIBERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]].add(subscriber);

  if (loadCurrent) {
    subscriber(CONTEXT_STATES_REGISTRY[managerConstructor[IDENTIFIER_KEY]]);
  }
}

/**
 * Unsubscribe from manager updates.
 */
export function unsubscribeFromManager<T extends object, D extends IContextManagerConstructor<T>>(
  managerConstructor: D,
  subscriber: TUpdateSubscriber<T>
): void {
  CONTEXT_SUBSCRIBERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]].delete(subscriber);
}

/**
 * Get current manager instance from registry.
 * Returns null if nothing is found.
 */
export function getCurrentManager<T extends TAnyContextManagerConstructor>(
  managerConstructor: T
): InstanceType<T> | null {
  return CONTEXT_MANAGERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]] as InstanceType<T> || null;
}

/**
 * Get current supplied context.
 */
export function getCurrentContext<S extends object, T extends IContextManagerConstructor<S>>(
  managerConstructor: T
): S | null {
  return CONTEXT_STATES_REGISTRY[managerConstructor[IDENTIFIER_KEY]] as S || null;
}
