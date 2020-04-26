import { TDreamstateWorker } from "../types";
import { CONTEXT_WORKERS_REGISTRY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Get current manager instance from registry.
 * Returns null if nothing is found.
 */
export function getCurrent<T extends TDreamstateWorker>(
  workerConstructor: T
): InstanceType<T> | null {
  log.info("Requested current manager:", workerConstructor.name);

  return CONTEXT_WORKERS_REGISTRY.get(workerConstructor) as InstanceType<T> || null;
}
