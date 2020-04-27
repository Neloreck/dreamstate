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
 * Wait for all queued events.
 * Promisified setTimeout(,0).
 */
export function nextAsyncQueue(): Promise<void> {
  return new Promise((resolve: () => void) => setTimeout(resolve));
}
