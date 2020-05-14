import { CONTEXT_STATES_REGISTRY } from "@Lib/core/internals";
import { TAnyContextManagerConstructor } from "@Lib/core/types";

import { debug } from "@Macro/debug.macro";

/**
 * Get current supplied context.
 */
export function getCurrentContext<T extends TAnyContextManagerConstructor>(
  Manager: T
): T["prototype"]["context"] | null {
  debug.info("Requested current manager context:", Manager.name);

  return CONTEXT_STATES_REGISTRY.get(Manager) || null;
}
