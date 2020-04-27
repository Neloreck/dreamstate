import { TDreamstateWorker } from "../types";
import { unsubscribeFromSignals } from "../signals";
import {
  CONTEXT_WORKERS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_WORKERS_ACTIVATED
} from "../internals";

import { log } from "../../build/macroses/log.macro";

export function unRegisterWorker<T extends object>(
  workerConstructor: TDreamstateWorker,
  forceUnregister: boolean = false
): void {
  // @ts-ignore
  if (!workerConstructor["IS_SINGLE"] || forceUnregister) {
    unsubscribeFromSignals(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(workerConstructor)!);

    CONTEXT_WORKERS_REGISTRY.delete(workerConstructor);
    CONTEXT_SIGNAL_HANDLERS_REGISTRY.delete(workerConstructor);
    // Do not check if it is CM - more expensive operation.
    CONTEXT_STATES_REGISTRY.delete(workerConstructor);
    // todo: If replace weak maps with maps, think about GC there. High probability of leak there?
    // Do not clean observers and subscribers, automated by react.

    // Delete possible context manager reference to prevent issues with GC.
    CONTEXT_WORKERS_ACTIVATED.delete(workerConstructor);

    log.info("Context worker instance disposed:", workerConstructor.name);
  } else {
    log.info("Context worker singleton should not be disposed:", workerConstructor.name);
  }
}
