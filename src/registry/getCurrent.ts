import { TDreamstateService } from "../types";
import { CONTEXT_SERVICES_REGISTRY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Get current manager instance from registry.
 * Returns null if nothing is found.
 */
export function getCurrent<T extends TDreamstateService>(
  Service: T
): InstanceType<T> | null {
  log.info("Requested current service:", Service.name);

  return CONTEXT_SERVICES_REGISTRY.get(Service) as InstanceType<T> || null;
}
