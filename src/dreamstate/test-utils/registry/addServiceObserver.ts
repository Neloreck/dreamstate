import { CONTEXT_SERVICES_REGISTRY } from "@/dreamstate/core/internals";
import { addServiceObserverToRegistry } from "@/dreamstate/core/registry/addServiceObserverToRegistry";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { TAnyContextManagerConstructor, TUpdateObserver } from "@/dreamstate/types";

/**
 * Add context manager observer and trigger all related events (onProvisionStarted for first observer).
 */
export function addServiceObserver(
  Service: TAnyContextManagerConstructor,
  observer: TUpdateObserver
) {
  if (!(Service.prototype instanceof ContextManager)) {
    throw new TypeError("Supplied class is not extending ContextManager.");
  }

  if (!CONTEXT_SERVICES_REGISTRY.get(Service)) {
    throw new Error("Supplied class was not registered.");
  }

  addServiceObserverToRegistry(Service, observer);
}
