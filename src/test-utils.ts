import { Context } from "react";

import { TAnyContextManagerConstructor, TDreamstateWorker, TUpdateObserver } from "./types";
import { ContextWorker } from "./management";
import {
  addWorkerObserverToRegistry,
  registerWorker as internalRegisterWorker,
  removeWorkerObserverFromRegistry,
  unRegisterWorker as internalUnRegisterWorker
} from "./registry";
import { CONTEXT_OBSERVERS_REGISTRY, CONTEXT_WORKERS_REGISTRY } from "./internals";

/**
 * Register worker class.
 */
export function registerWorker<T extends TDreamstateWorker>(workerClass: T): InstanceType<T> {
  if (!workerClass || !workerClass.prototype || !(workerClass.prototype instanceof ContextWorker)) {
    throw new TypeError("Cannot register invalid worker. Expected class extending ContextWorker.");
  }

  internalRegisterWorker(workerClass);

  return CONTEXT_WORKERS_REGISTRY.get(workerClass) as InstanceType<T>;
}

/**
 * Unregister worker.
 */
export function unRegisterWorker<T extends TDreamstateWorker>(
  workerClass: T,
  forceUnregister: boolean = false
): void {
  if (!workerClass || !workerClass.prototype || !(workerClass.prototype instanceof ContextWorker)) {
    throw new TypeError("Cannot register invalid worker. Expected class extending ContextWorker.");
  }

  internalUnRegisterWorker(workerClass, forceUnregister);
}

/**
 * Get current worker observerrs count or null if it is not registered.
 * Observers - all points that create react context provision.
 */
export function getWorkerObserversCount<T extends TDreamstateWorker>(
  workerClass: T
): number | null {
  if (CONTEXT_OBSERVERS_REGISTRY.has(workerClass)) {
    return CONTEXT_OBSERVERS_REGISTRY.get(workerClass)!.size;
  } else {
    return null;
  }
}

/**
 * Check if current worker is provided.
 */
export function isWorkerProvided<T extends TDreamstateWorker>(
  workerClass: T
): boolean {
  return Boolean(getWorkerObserversCount(workerClass));
}

/**
 * Add context manager observer and trigger all related events (onProvisionStarted for first observer).
 */
export function addManagerObserver<T extends TAnyContextManagerConstructor>(
  managerConstructor: T,
  observer: TUpdateObserver
) {
  addWorkerObserverToRegistry(managerConstructor, observer);
}

/**
 * Add context manager observer and trigger all related events (onProvisionEnded for last observer).
 */
export function removeManagerObserver<T extends TAnyContextManagerConstructor>(
  managerConstructor: T,
  observer: TUpdateObserver
) {
  removeWorkerObserverFromRegistry(managerConstructor, observer);
}

/**
 * Get react provider of selected context manager.
 */
export function getReactConsumer<T extends TAnyContextManagerConstructor>(
  managerConstructor: T
): Context<T["prototype"]["context"]>["Consumer"] {
  return managerConstructor.REACT_CONTEXT.Consumer;
}

/**
 * Get react provider of selected context manager.
 */
export function getReactProvider<T extends TAnyContextManagerConstructor>(
  managerConstructor: T
): Context<T["prototype"]["context"]>["Provider"] {
  return managerConstructor.REACT_CONTEXT.Provider;
}

/**
 * Wait for all queued events.
 * Promisified setTimeout(,0).
 */
export function nextAsyncQueue(): Promise<void> {
  return new Promise((resolve: () => void) => setTimeout(resolve));
}
