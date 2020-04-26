import { TDreamstateWorker, TSignalListener } from "../types";
import { ContextManager } from "../management";
import { onMetadataSignalListenerCalled, subscribeToSignals } from "../signals";
import {
  CONTEXT_WORKERS_REGISTRY,
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY,
  CONTEXT_WORKERS_ACTIVATED
} from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Register context manager entry.
 */
export function registerWorker<T extends object>(
  workerConstructor: TDreamstateWorker
): void {
  // Only if registry is empty -> create new instance, remember its context and save it to registry.
  if (!CONTEXT_WORKERS_REGISTRY.has(workerConstructor)) {
    const instance: InstanceType<TDreamstateWorker> = new workerConstructor();
    const signalHandler: TSignalListener = onMetadataSignalListenerCalled.bind(instance);

    // Currently only context managers require additional information initialization.
    if (workerConstructor.prototype instanceof ContextManager) {
      CONTEXT_STATES_REGISTRY.set(workerConstructor, (instance as ContextManager<object>).context);
      // Subscribers are not always sync, should not block their un-sub later.
      CONTEXT_SUBSCRIBERS_REGISTRY.set(
        workerConstructor,
        CONTEXT_SUBSCRIBERS_REGISTRY.get(workerConstructor) || new Set()
      );
    }

    CONTEXT_OBSERVERS_REGISTRY.set(workerConstructor, CONTEXT_OBSERVERS_REGISTRY.get(workerConstructor) || new Set());
    CONTEXT_WORKERS_REGISTRY.set(workerConstructor, instance);
    CONTEXT_SIGNAL_HANDLERS_REGISTRY.set(workerConstructor, signalHandler);

    subscribeToSignals(signalHandler);

    CONTEXT_WORKERS_ACTIVATED.add(workerConstructor);

    log.info("Worker registered:", workerConstructor.name);
  } else {
    // We cannot rely on react memo and tell that it is called only once.
    // Also can be called from other sub-trees.
    log.info("Worker already registered, continue with old instance:", workerConstructor.name);
  }
}
