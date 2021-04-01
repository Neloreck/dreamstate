import { CONTEXT_OBSERVERS_REGISTRY } from "@/dreamstate/core/internals";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import { TAnyObject, TDreamstateService } from "@/dreamstate/types";

/**
 * Get current service observers count.
 * Observers - all points that create react context provision.
 */
export function getServiceObserversCount<S extends TAnyObject, T extends TDreamstateService<S>>(
  Service: T
): number | null {
  if (!(Service.prototype instanceof ContextService)) {
    throw new TypeError("Supplied parameter should be class extending Service.");
  }

  if (!CONTEXT_OBSERVERS_REGISTRY.has(Service)) {
    throw new Error("Supplied class was not registered.");
  }

  return CONTEXT_OBSERVERS_REGISTRY.get(Service)!.size;
}
