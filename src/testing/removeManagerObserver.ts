import { ContextManager } from "..";
import { TAnyContextManagerConstructor, TUpdateObserver } from "../types";
import { CONTEXT_WORKERS_REGISTRY } from "../internals";
import { removeWorkerObserverFromRegistry } from "../registry";

/**
 * Add context manager observer and trigger all related events (onProvisionEnded for last observer).
 */
export function removeManagerObserver<T extends TAnyContextManagerConstructor>(
  managerConstructor: T,
  observer: TUpdateObserver
) {
  if (!(managerConstructor.prototype instanceof ContextManager)) {
    throw new TypeError("Supplied class is not extending ContextWorker.");
  }

  if (!CONTEXT_WORKERS_REGISTRY.get(managerConstructor)) {
    throw new Error("Supplied class was not registered.");
  }

  removeWorkerObserverFromRegistry(managerConstructor, observer);
}
