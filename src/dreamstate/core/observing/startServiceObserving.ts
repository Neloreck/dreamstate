import { CONTEXT_SERVICES_REFERENCES, CONTEXT_SERVICES_REGISTRY } from "@/dreamstate/core/internals";
import { TDreamstateService } from "@/dreamstate/types";

/**
 * todo;
 */
export function startServiceObserving(
  Service: TDreamstateService
): void {
  const referencesCount: number = CONTEXT_SERVICES_REFERENCES.get(Service)! + 1;

  CONTEXT_SERVICES_REFERENCES.set(Service, referencesCount);

  if (referencesCount === 1) {
    CONTEXT_SERVICES_REGISTRY.get(Service)!["onProvisionStarted"]();
  }
}
