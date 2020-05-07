import { TDreamstateWorker } from "../types";
import { ContextWorker } from "../";
import { registerWorker as internalRegisterWorker } from "../registry";
import { CONTEXT_WORKERS_REGISTRY } from "../internals";

/**
 * Register worker class.
 */
export function registerWorker<T extends TDreamstateWorker>(workerClass: T): InstanceType<T> {
  if (!workerClass || !workerClass.prototype || !(workerClass.prototype instanceof ContextWorker)) {
    throw new TypeError("Cannot register invalid worker. Expected class extending ContextWorker.");
  }

  internalRegisterWorker(workerClass);

  return CONTEXT_WORKERS_REGISTRY.get(workerClass) as InstanceType<T>;
}
