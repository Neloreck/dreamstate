import { CONTEXT_SERVICES_REFERENCES, CONTEXT_SERVICES_REGISTRY } from "@/dreamstate/core/internals";
import { TDreamstateService } from "@/dreamstate/types";

/**
 * Start observing of service and trigger related lifecycle methods.
 * Count providers references so it will work with few different providers
 * and force 'onProvisionStarted' to be used only once.
 */
export function startServiceObserving(
  Service: TDreamstateService<any>
): void {
  const referencesCount: number = CONTEXT_SERVICES_REFERENCES.get(Service)! + 1;

  CONTEXT_SERVICES_REFERENCES.set(Service, referencesCount);

  if (referencesCount === 1) {
    CONTEXT_SERVICES_REGISTRY.get(Service)!["onProvisionStarted"]();
  }
}
