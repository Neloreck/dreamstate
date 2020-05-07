import { TDreamstateWorker, TUpdateObserver } from "../types";
import { CONTEXT_OBSERVERS_REGISTRY } from "../internals";

/**
 * Check if current worker is provided.
 */
export function isWorkerProvided<T extends TDreamstateWorker>(
  workerClass: T
): boolean {
  const registry: Set<TUpdateObserver> | undefined = CONTEXT_OBSERVERS_REGISTRY.get(workerClass);

  if (registry) {
    return registry.size > 0;
  } else {
    return false;
  }
}
