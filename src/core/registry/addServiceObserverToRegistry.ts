import { CONTEXT_SERVICES_REGISTRY, CONTEXT_OBSERVERS_REGISTRY } from "@Lib/core/internals";
import { ContextService } from "@Lib/core/management/ContextService";
import { TDreamstateService, TUpdateObserver } from "@Lib/core/types";

import { debug } from "@Macro/debug.macro";

/**
 * Add state changes observer.
 */
export function addServiceObserverToRegistry(
  Service: TDreamstateService,
  observer: TUpdateObserver
): void {
  CONTEXT_OBSERVERS_REGISTRY.get(Service)!.add(observer);

  debug.info("Service observer added:", Service.name);

  // Notify about provision, if it is first observer.
  if (CONTEXT_OBSERVERS_REGISTRY.get(Service)!.size === 1) {
    debug.info("Service provision started:", Service.name);
    (CONTEXT_SERVICES_REGISTRY.get(Service) as ContextService)["onProvisionStarted"]();
  }
}
