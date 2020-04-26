import { TDreamstateWorker } from "../types";
import { ContextWorker } from "../management";
import { unsubscribeFromSignals } from "../signals";
import {
  CONTEXT_WORKERS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY
} from "../internals";

import { log } from "../../build/macroses/log.macro";

export function unRegisterWorker<T extends object>(
  workerConstructor: TDreamstateWorker,
  forceUnregister: boolean = false
): void {
  const instance: ContextWorker | undefined = CONTEXT_WORKERS_REGISTRY.get(workerConstructor);

  if (!instance) {
    log.error("Worker failed to unregister:", workerConstructor.name);
    throw new Error("Could not find manager instance when unregister it.");
  } else {
    instance["onProvisionEnded"]();
    log.info("Context worker provision ended:", workerConstructor.name);

    // @ts-ignore
    if (!workerConstructor["IS_SINGLE"] || forceUnregister) {
      unsubscribeFromSignals(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(workerConstructor)!);

      CONTEXT_WORKERS_REGISTRY.delete(workerConstructor);
      CONTEXT_SIGNAL_HANDLERS_REGISTRY.delete(workerConstructor);
      // Do not check if it is CM - more expensive operation.
      CONTEXT_STATES_REGISTRY.delete(workerConstructor);
      // Do not clean observers and subscribers, automated by react.

      log.info("Context worker instance disposed:", workerConstructor.name);
    } else {
      log.info("Context worker singleton should not be disposed:", workerConstructor.name);
    }

    log.info("Worker unregistered:", workerConstructor.name);
  }
}
