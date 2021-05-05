import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Get current manager instance from registry.
 * Returns null if nothing is found.
 */
export function getCurrent<T extends TAnyContextManagerConstructor>(
  Service: T
): InstanceType<T> | null {
  // todo: return CONTEXT_SERVICES_REGISTRY.get(Service) as InstanceType<T> || null;
  return null as any;
}
