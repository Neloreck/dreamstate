import { TDreamstateService } from "@Lib/types";
import { CONTEXT_SERVICES_REGISTRY } from "@Lib/internals";

import { debug } from "@Macro/debug.macro";

/**
 * Get current manager instance from registry.
 * Returns null if nothing is found.
 */
export function getCurrent<T extends TDreamstateService>(
  Service: T
): InstanceType<T> | null {
  debug.info("Requested current service:", Service.name);

  return CONTEXT_SERVICES_REGISTRY.get(Service) as InstanceType<T> || null;
}
