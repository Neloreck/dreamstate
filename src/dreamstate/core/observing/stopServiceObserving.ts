import { CONTEXT_SERVICES_REFERENCES, CONTEXT_SERVICES_REGISTRY } from "@/dreamstate/core/internals";
import { unRegisterService } from "@/dreamstate/core/registry/unRegisterService";
import { TDreamstateService } from "@/dreamstate/types";

/**
 * todo;
 */
export function stopServiceObserving(
  Service: TDreamstateService
): void {
  const referencesCount: number = CONTEXT_SERVICES_REFERENCES.get(Service)! - 1;

  CONTEXT_SERVICES_REFERENCES.set(Service, referencesCount);

  if (referencesCount === 0) {
    CONTEXT_SERVICES_REGISTRY.get(Service)!["onProvisionEnded"]();
    unRegisterService(Service);
  }
}
