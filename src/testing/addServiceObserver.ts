import { TDreamstateService, TUpdateObserver } from "@Lib/types";
import { CONTEXT_SERVICES_REGISTRY } from "@Lib/internals";
import { ContextService } from "@Lib/management/ContextService";
import { addServiceObserverToRegistry } from "@Lib/registry/addServiceObserverToRegistry";

/**
 * Add context manager observer and trigger all related events (onProvisionStarted for first observer).
 */
export function addServiceObserver<T extends TDreamstateService>(
  Service: T,
  observer: TUpdateObserver
) {
  if (!(Service.prototype instanceof ContextService)) {
    throw new TypeError("Supplied class is not extending ContextService.");
  }

  if (!CONTEXT_SERVICES_REGISTRY.get(Service)) {
    throw new Error("Supplied class was not registered.");
  }

  addServiceObserverToRegistry(Service, observer);
}
