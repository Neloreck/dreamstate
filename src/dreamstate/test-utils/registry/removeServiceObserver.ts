import { CONTEXT_SERVICES_REGISTRY } from "@/dreamstate/core/internals";
import { removeServiceObserverFromRegistry } from "@/dreamstate/core/registry/removeServiceObserverFromRegistry";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import { TDreamstateService, TUpdateObserver } from "@/dreamstate/types";

/**
 * Add context manager observer and trigger all related events (onProvisionEnded for last observer).
 */
export function removeServiceObserver(
  Service: TDreamstateService<any>,
  observer: TUpdateObserver
) {
  if (!(Service.prototype instanceof ContextService)) {
    throw new TypeError("Supplied class is not extending ContextService.");
  }

  if (!CONTEXT_SERVICES_REGISTRY.get(Service)) {
    throw new Error("Supplied class was not registered.");
  }

  removeServiceObserverFromRegistry(Service, observer);
}
