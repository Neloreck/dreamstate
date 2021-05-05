import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Get current supplied context.
 */
export function getCurrentContext<T extends TAnyContextManagerConstructor>(
  Manager: T
): T["prototype"]["context"] | null {
  // todo; return CONTEXT_STATES_REGISTRY.get(Manager) || null;
  return null as any;
}
