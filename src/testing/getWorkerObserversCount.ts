import { TDreamstateWorker } from "../types";
import { CONTEXT_OBSERVERS_REGISTRY } from "../internals";

/**
 * Get current worker observers count.
 * Observers - all points that create react context provision.
 */
export function getWorkerObserversCount<T extends TDreamstateWorker>(
  workerClass: T
): number | null {
  if (!CONTEXT_OBSERVERS_REGISTRY.has(workerClass)) {
    throw new Error("Supplied class was not registered.");
  }

  return CONTEXT_OBSERVERS_REGISTRY.get(workerClass)!.size;
}
