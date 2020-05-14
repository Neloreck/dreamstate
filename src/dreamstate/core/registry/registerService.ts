import { debug } from "@/macroses/debug.macro";

import {
  CONTEXT_SERVICES_REGISTRY,
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY,
  CONTEXT_SERVICES_ACTIVATED
} from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { onMetadataSignalListenerCalled } from "@/dreamstate/signals/onMetadataSignalListenerCalled";
import { subscribeToSignals } from "@/dreamstate/signals/subscribeToSignals";
import { TDreamstateService, TSignalListener } from "@/dreamstate/types";

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

    debug.info("Service registered:", Service.name);
  } else {
    // We cannot rely on react memo and tell that it is called only once.
    // Also can be called from other sub-trees.
    debug.info("Service already registered, continue with old instance:", Service.name);
  }
}
