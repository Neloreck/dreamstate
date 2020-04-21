import { TAnyContextManagerConstructor } from "../types";
import { CONTEXT_MANAGERS_REGISTRY, IDENTIFIER_KEY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Get current manager instance from registry.
 * Returns null if nothing is found.
 */
export function getCurrentManager<T extends TAnyContextManagerConstructor>(
  managerConstructor: T
): InstanceType<T> | null {
  log.info("Requested current manager:", managerConstructor.name);

  return CONTEXT_MANAGERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]] as InstanceType<T> || null;
}
