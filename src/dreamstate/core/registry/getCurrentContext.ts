import { CONTEXT_STATES_REGISTRY } from "@/dreamstate/core/internals";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Get current supplied context.
 */
export function getCurrentContext<T extends TAnyContextManagerConstructor>(
  Manager: T
): T["prototype"]["context"] | null {
  return CONTEXT_STATES_REGISTRY.get(Manager) || null;
}
