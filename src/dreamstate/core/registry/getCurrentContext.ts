import { debug } from "@/macroses/debug.macro";

import { CONTEXT_STATES_REGISTRY } from "@/dreamstate/core/internals";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Get current supplied context.
 */
export function getCurrentContext<T extends TAnyContextManagerConstructor>(
  Manager: T
): T["prototype"]["context"] | null {
  debug.info("Requested current manager context:", Manager.name);

  return CONTEXT_STATES_REGISTRY.get(Manager) || null;
}
