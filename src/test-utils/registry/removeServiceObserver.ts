import { CONTEXT_SERVICES_REGISTRY } from "@Lib/core/internals";
import { ContextService } from "@Lib/core/management/ContextService";
import { removeServiceObserverFromRegistry } from "@Lib/core/registry/removeServiceObserverFromRegistry";
import { TDreamstateService, TUpdateObserver } from "@Lib/core/types";

/**
 * Add context manager observer and trigger all related events (onProvisionEnded for last observer).
 */
export function removeServiceObserver<T extends TDreamstateService>(
  Service: T,
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
