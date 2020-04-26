import { TAnyContextManagerConstructor, TDreamstateWorker, TUpdateObserver } from "./types";
import {
  addWorkerObserverToRegistry,
  registerWorker,
  removeWorkerObserverFromRegistry,
  unRegisterWorker
} from "./registry";
import { CONTEXT_OBSERVERS_REGISTRY, CONTEXT_SUBSCRIBERS_REGISTRY, CONTEXT_WORKERS_REGISTRY } from "./internals";

/**
 * Register worker class.
 */
export function registerWorkerClass<T extends TDreamstateWorker>(workerClass: T): InstanceType<T> {
  registerWorker(workerClass);

  return CONTEXT_WORKERS_REGISTRY.get(workerClass) as InstanceType<T>;
}

/**
 * Unregister worker.
 */
export function unRegisterWorkerClass<T extends TDreamstateWorker>(
  workerClass: T,
  forceUnregister: boolean = false
): void {
  unRegisterWorker(workerClass, forceUnregister);
}

/**
 * Get current worker subscribers count or null if it is not registered.
 */
export function getWorkerObserversCount<T extends TDreamstateWorker>(
  workerClass: T
): number | null {
  if (CONTEXT_OBSERVERS_REGISTRY.has(workerClass) && CONTEXT_SUBSCRIBERS_REGISTRY.has(workerClass)) {
    return CONTEXT_OBSERVERS_REGISTRY.get(workerClass)!.size + CONTEXT_SUBSCRIBERS_REGISTRY.get(workerClass)!.size;
  } else {
    return null;
  }
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
 * Wait for all queued events.
 * Promisified setTimeout(,0).
 */
export function nextAsyncQueue(): Promise<void> {
  return new Promise((resolve: () => void) => setTimeout(resolve));
}
