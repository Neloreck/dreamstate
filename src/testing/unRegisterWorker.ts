import { TDreamstateWorker } from "../types";
import { ContextWorker } from "..";
import { unRegisterWorker as internalUnRegisterWorker } from "../registry";

/**
 * Unregister worker.
 */
export function unRegisterWorker<T extends TDreamstateWorker>(
  workerClass: T,
  forceUnregister: boolean = true
): void {
  if (!workerClass || !workerClass.prototype || !(workerClass.prototype instanceof ContextWorker)) {
    throw new TypeError("Cannot register invalid worker. Expected class extending ContextWorker.");
  }

  internalUnRegisterWorker(workerClass, forceUnregister);
}
