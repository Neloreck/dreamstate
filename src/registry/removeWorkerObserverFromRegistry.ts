import type { ContextWorker } from "../management";
import type { TDreamstateWorker, TUpdateObserver } from "../types";
import {
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_WORKERS_REGISTRY
} from "../internals";
import { unRegisterWorker } from "./unRegisterWorker";

import { log } from "../../build/macroses/log.macro";

/**
 * Remove state changes observer and kill instance if it is not singleton.
 */
export function removeWorkerObserverFromRegistry(
  workerConstructor: TDreamstateWorker,
  observer: TUpdateObserver
): void {
  CONTEXT_OBSERVERS_REGISTRY.get(workerConstructor)!.delete(observer);

  log.info("Worker observer removed:", workerConstructor.name);

  if (CONTEXT_OBSERVERS_REGISTRY.get(workerConstructor)!.size === 0) {
    const instance: ContextWorker | undefined = CONTEXT_WORKERS_REGISTRY.get(workerConstructor)!;

    if (instance) {
      instance["onProvisionEnded"]();

      log.info("Worker provision ended:", workerConstructor.name);

      unRegisterWorker(workerConstructor);
    } else {
      log.error("Worker failed to unregister:", workerConstructor.name);
      throw new Error("Could not find manager instance when provision ended.");
    }
  }
}
