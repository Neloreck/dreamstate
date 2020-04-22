import { TAnyContextManagerConstructor } from "../types";
import { CONTEXT_STATES_REGISTRY, IDENTIFIER_KEY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Get current supplied context.
 */
export function getCurrentContext<T extends TAnyContextManagerConstructor>(
  managerConstructor: T
): T["prototype"]["context"] | null {
  log.info("Requested current manager context:", managerConstructor.name);

  return CONTEXT_STATES_REGISTRY[managerConstructor[IDENTIFIER_KEY]] || null;
}
