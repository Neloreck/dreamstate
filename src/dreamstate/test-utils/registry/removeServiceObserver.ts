import { CONTEXT_SERVICES_REGISTRY } from "@/dreamstate/core/internals";
import { removeServiceObserverFromRegistry } from "@/dreamstate/core/registry/removeServiceObserverFromRegistry";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { TAnyContextManagerConstructor, TUpdateObserver } from "@/dreamstate/types";

/**
 * Add context manager observer and trigger all related events (onProvisionEnded for last observer).
 */
export function removeServiceObserver(
  Service: TAnyContextManagerConstructor,
  observer: TUpdateObserver
) {
  if (!(Service.prototype instanceof ContextManager)) {
    throw new TypeError("Supplied class is not extending ContextManager.");
  }

  if (!CONTEXT_SERVICES_REGISTRY.get(Service)) {
    throw new Error("Supplied class was not registered.");
  }

  removeServiceObserverFromRegistry(Service, observer);
}
