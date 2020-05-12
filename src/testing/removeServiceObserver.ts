import { ContextService } from "..";
import { TDreamstateService, TUpdateObserver } from "../types";
import { CONTEXT_SERVICES_REGISTRY } from "../internals";
import { removeServiceObserverFromRegistry } from "../registry";

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
