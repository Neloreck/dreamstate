import { CONTEXT_OBSERVERS_REGISTRY, CONTEXT_SERVICES_REGISTRY } from "@/dreamstate/core/internals";
import { unRegisterService } from "@/dreamstate/core/registry/unRegisterService";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import { TDreamstateService, TUpdateObserver } from "@/dreamstate/types";

/**
 * Remove state changes observer and kill instance if it is not singleton.
 */
export function removeServiceObserverFromRegistry(
  Service: TDreamstateService,
  observer: TUpdateObserver
): void {
  CONTEXT_OBSERVERS_REGISTRY.get(Service)!.delete(observer);

  if (CONTEXT_OBSERVERS_REGISTRY.get(Service)!.size === 0) {
    const instance: ContextService | undefined = CONTEXT_SERVICES_REGISTRY.get(Service)!;

    if (instance) {
      instance["onProvisionEnded"]();

      unRegisterService(Service);
    } else {
      throw new Error("Could not find manager instance when provision ended.");
    }
  }
}
