import {
  IContextManagerConstructor,
  IStringIndexed, TAnyContextManagerConstructor,
  TUpdateObserver,
  TUpdateSubscriber
} from "./types";
import { ContextManager } from "./management";
import { IDENTIFIER_KEY, SIGNAL_LISTENER_KEY } from "./internals";
import { subscribeToSignals, unsubscribeFromSignals } from "./signals";

import { log } from "../macroses/log.macro";

declare const IS_DEBUG: boolean;

export const CONTEXT_MANAGERS_REGISTRY: IStringIndexed<ContextManager<any>> = {};
export const CONTEXT_OBSERVERS_REGISTRY: IStringIndexed<Set<TUpdateObserver>> = {};
export const CONTEXT_SUBSCRIBERS_REGISTRY: IStringIndexed<Set<TUpdateSubscriber<any>>> = {};
export const CONTEXT_STATES_REGISTRY: IStringIndexed<any> = {};

/**
 * Expose internal registry references for debugging.
 */
if (IS_DEBUG) {
  // @ts-ignore debug-only declaration.
  window.__DREAMSTATE_CONTEXT_REGISTRY__ = {
    CONTEXT_MANAGERS_REGISTRY,
    CONTEXT_OBSERVERS_REGISTRY,
    CONTEXT_SUBSCRIBERS_REGISTRY,
    CONTEXT_STATES_REGISTRY
  };
}

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

    log.info("Context manager registered:", managerConstructor.name);
  } else {
    log.info("Context manager already registered, continue with old instance:", managerConstructor.name);
  }
}

export function unRegisterManager<T extends object>(
  managerConstructor: IContextManagerConstructor<T>,
): void {
  const instance: ContextManager<T> | undefined = CONTEXT_MANAGERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]];

  if (!instance) {
    log.error("Context manager failed to unregister:", managerConstructor.name);
    throw new Error("Could not find manager instance when unregister it.");
  } else {
    instance["onProvisionEnded"]();

    log.info("Context manager provision ended:", managerConstructor.name);

    // @ts-ignore
    if (!managerConstructor["IS_SINGLE"]) {
      unsubscribeFromSignals(instance[SIGNAL_LISTENER_KEY]);

      delete CONTEXT_STATES_REGISTRY[managerConstructor[IDENTIFIER_KEY]];
      delete CONTEXT_MANAGERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]];

      log.info("Context manager instance disposed:", managerConstructor.name);
    } else {
      log.info("Context manager instance should not be disposed:", managerConstructor.name);
    }

    log.info("Context manager unregistered:", managerConstructor.name);
  }
}

/**
 * Add state changes observer.
 */
export function addManagerObserverToRegistry<T extends object>(
  managerConstructor: IContextManagerConstructor<T>,
  observer: TUpdateObserver
): void {
  CONTEXT_OBSERVERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]].add(observer);

  log.info("Context manager observer added:", managerConstructor.name);

  // Notify about provision, if it is first observer.
  if (CONTEXT_OBSERVERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]].size === 1) {
    log.info("Context manager provision started:", managerConstructor.name);
    CONTEXT_MANAGERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]]["onProvisionStarted"]();
  }
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

  log.info("Context manager observer removed:", managerConstructor.name);

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

  log.info("Context manager subscriber added:", managerConstructor.name, loadCurrent);

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
  log.info("Context manager subscriber removed:", managerConstructor.name);

  CONTEXT_SUBSCRIBERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]].delete(subscriber);
}

/**
 * Get current manager instance from registry.
 * Returns null if nothing is found.
 */
export function getCurrentManager<T extends TAnyContextManagerConstructor>(
  managerConstructor: T
): InstanceType<T> | null {
  log.info("Requested current manager:", managerConstructor.name);

  return CONTEXT_MANAGERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]] as InstanceType<T> || null;
}

/**
 * Get current supplied context.
 */
export function getCurrentContext<S extends object, T extends IContextManagerConstructor<S>>(
  managerConstructor: T
): S | null {
  log.info("Requested current manager context:", managerConstructor.name);

  return CONTEXT_STATES_REGISTRY[managerConstructor[IDENTIFIER_KEY]] as S || null;
}
