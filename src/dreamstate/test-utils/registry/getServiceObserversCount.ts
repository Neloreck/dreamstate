import { CONTEXT_OBSERVERS_REGISTRY } from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { TAnyObject, TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Get current service observers count.
 * Observers - all points that create react context provision.
 */
export function getServiceObserversCount<S extends TAnyObject, T extends TAnyContextManagerConstructor>(
  Service: T
): number | null {
  if (!(Service.prototype instanceof ContextManager)) {
    throw new TypeError("Supplied parameter should be class extending ContextManager.");
  }

  if (!CONTEXT_OBSERVERS_REGISTRY.has(Service)) {
    throw new Error("Supplied class was not registered.");
  }

  return CONTEXT_OBSERVERS_REGISTRY.get(Service)!.size;
}
