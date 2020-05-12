import { ContextService } from "../management/ContextService";
import { TDreamstateService, TUpdateObserver } from "../types";
import {
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_SERVICES_REGISTRY
} from "../internals";
import { unRegisterService } from "./unRegisterService";

import { log } from "../../build/macroses/log.macro";

/**
 * Remove state changes observer and kill instance if it is not singleton.
 */
export function removeServiceObserverFromRegistry(
  Service: TDreamstateService,
  observer: TUpdateObserver
): void {
  CONTEXT_OBSERVERS_REGISTRY.get(Service)!.delete(observer);

  log.info("Service observer removed:", Service.name);

  if (CONTEXT_OBSERVERS_REGISTRY.get(Service)!.size === 0) {
    const instance: ContextService | undefined = CONTEXT_SERVICES_REGISTRY.get(Service)!;

    if (instance) {
      instance["onProvisionEnded"]();

      log.info("Service provision ended:", Service.name);

      unRegisterService(Service);
    } else {
      log.error("Service failed to unregister:", Service.name);
      throw new Error("Could not find manager instance when provision ended.");
    }
  }
}