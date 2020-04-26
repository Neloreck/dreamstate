import type { ContextWorker } from "../management";
import { TDreamstateWorker, TUpdateObserver } from "../types";
import { CONTEXT_WORKERS_REGISTRY, CONTEXT_OBSERVERS_REGISTRY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Add state changes observer.
 */
export function addWorkerObserverToRegistry(
  workerConstructor: TDreamstateWorker,
  observer: TUpdateObserver
): void {
  CONTEXT_OBSERVERS_REGISTRY.get(workerConstructor)!.add(observer);

  log.info("Worker observer added:", workerConstructor.name);

  // Notify about provision, if it is first observer.
  if (CONTEXT_OBSERVERS_REGISTRY.get(workerConstructor)!.size === 1) {
    log.info("Worker provision started:", workerConstructor.name);
    (CONTEXT_WORKERS_REGISTRY.get(workerConstructor) as ContextWorker)["onProvisionStarted"]();
  }
}
