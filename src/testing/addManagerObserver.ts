import { TAnyContextManagerConstructor, TUpdateObserver } from "../types";
import { ContextManager } from "../";
import { CONTEXT_WORKERS_REGISTRY } from "../internals";
import { addWorkerObserverToRegistry } from "../registry";

/**
 * Add context manager observer and trigger all related events (onProvisionStarted for first observer).
 */
export function addManagerObserver<T extends TAnyContextManagerConstructor>(
  managerConstructor: T,
  observer: TUpdateObserver
) {
  if (!(managerConstructor.prototype instanceof ContextManager)) {
    throw new TypeError("Supplied class is not extending ContextWorker.");
  }

  if (!CONTEXT_WORKERS_REGISTRY.get(managerConstructor)) {
    throw new Error("Supplied class was not registered.");
  }

  addWorkerObserverToRegistry(managerConstructor, observer);
}
