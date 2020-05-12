import { TDreamstateService, TSignalListener } from "../types";
import { ContextManager } from "../management/ContextManager";
import { onMetadataSignalListenerCalled, subscribeToSignals } from "../signals";
import {
  CONTEXT_SERVICES_REGISTRY,
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY,
  CONTEXT_SERVICES_ACTIVATED
} from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Register context manager entry.
 */
export function registerService<T extends object>(
  Service: TDreamstateService
): void {
  // Only if registry is empty -> create new instance, remember its context and save it to registry.
  if (!CONTEXT_SERVICES_REGISTRY.has(Service)) {
    const instance: InstanceType<TDreamstateService> = new Service();
    const signalHandler: TSignalListener = onMetadataSignalListenerCalled.bind(instance);

    // Currently only context managers require additional information initialization.
    if (Service.prototype instanceof ContextManager) {
      CONTEXT_STATES_REGISTRY.set(Service, (instance as ContextManager<object>).context);
      // Subscribers are not always sync, should not block their un-sub later.
      CONTEXT_SUBSCRIBERS_REGISTRY.set(
        Service,
        CONTEXT_SUBSCRIBERS_REGISTRY.get(Service) || new Set()
      );
    }

    CONTEXT_OBSERVERS_REGISTRY.set(Service, CONTEXT_OBSERVERS_REGISTRY.get(Service) || new Set());
    CONTEXT_SERVICES_REGISTRY.set(Service, instance);
    CONTEXT_SIGNAL_HANDLERS_REGISTRY.set(Service, signalHandler);

    subscribeToSignals(signalHandler);

    CONTEXT_SERVICES_ACTIVATED.add(Service);

    log.info("Service registered:", Service.name);
  } else {
    // We cannot rely on react memo and tell that it is called only once.
    // Also can be called from other sub-trees.
    log.info("Service already registered, continue with old instance:", Service.name);
  }
}
