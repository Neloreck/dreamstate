import { ContextService } from "../management/ContextService";
import { TDreamstateService, TUpdateObserver } from "../types";
import { CONTEXT_SERVICES_REGISTRY, CONTEXT_OBSERVERS_REGISTRY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Add state changes observer.
 */
export function addServiceObserverToRegistry(
  Service: TDreamstateService,
  observer: TUpdateObserver
): void {
  CONTEXT_OBSERVERS_REGISTRY.get(Service)!.add(observer);

  log.info("Service observer added:", Service.name);

  // Notify about provision, if it is first observer.
  if (CONTEXT_OBSERVERS_REGISTRY.get(Service)!.size === 1) {
    log.info("Service provision started:", Service.name);
    (CONTEXT_SERVICES_REGISTRY.get(Service) as ContextService)["onProvisionStarted"]();
  }
}
