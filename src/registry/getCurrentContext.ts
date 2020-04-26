import { TAnyContextManagerConstructor } from "../types";
import { CONTEXT_STATES_REGISTRY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Get current supplied context.
 */
export function getCurrentContext<T extends TAnyContextManagerConstructor>(
  managerConstructor: T
): T["prototype"]["context"] | null {
  log.info("Requested current manager context:", managerConstructor.name);

  return CONTEXT_STATES_REGISTRY.get(managerConstructor) || null;
}
