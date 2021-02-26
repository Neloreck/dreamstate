import { CONTEXT_SERVICES_REGISTRY } from "@/dreamstate/core/internals";
import { TDreamstateService } from "@/dreamstate/types";

/**
 * Get current manager instance from registry.
 * Returns null if nothing is found.
 */
export function getCurrent<T extends TDreamstateService>(
  Service: T
): InstanceType<T> | null {
  return CONTEXT_SERVICES_REGISTRY.get(Service) as InstanceType<T> || null;
}