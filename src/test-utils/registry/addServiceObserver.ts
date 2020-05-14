import { CONTEXT_SERVICES_REGISTRY } from "@Lib/core/internals";
import { ContextService } from "@Lib/core/management/ContextService";
import { addServiceObserverToRegistry } from "@Lib/core/registry/addServiceObserverToRegistry";
import { TDreamstateService, TUpdateObserver } from "@Lib/core/types";

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
