import { TDreamstateWorker, TUpdateObserver } from "../types";
import { CONTEXT_OBSERVERS_REGISTRY } from "../internals";
import { unRegisterWorker } from "./unRegisterWorker";

import { log } from "../../build/macroses/log.macro";

/**
 * Remove state changes observer and kill instance if it is not singleton.
 */
export function removeWorkerObserverFromRegistry(
  workerConstructor: TDreamstateWorker,
  observer: TUpdateObserver
): void {
  // Remove observer.
  CONTEXT_OBSERVERS_REGISTRY.get(workerConstructor)!.delete(observer);

  log.info("Worker observer removed:", workerConstructor.name);

  if (CONTEXT_OBSERVERS_REGISTRY.get(workerConstructor)!.size === 0) {
    unRegisterWorker(workerConstructor);
  }
}
