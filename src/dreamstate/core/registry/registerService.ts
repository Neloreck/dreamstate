import {
  CONTEXT_SERVICES_REGISTRY,
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY,
  CONTEXT_SERVICES_ACTIVATED,
  CONTEXT_SERVICES_REFERENCES
} from "@/dreamstate/core/internals";
import { processComputed } from "@/dreamstate/core/storing/processComputed";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { onMetadataSignalListenerCalled } from "@/dreamstate/core/signals/onMetadataSignalListenerCalled";
import { subscribeToSignals } from "@/dreamstate/core/signals/subscribeToSignals";
import { TAnyContextManagerConstructor, TAnyObject, TSignalListener } from "@/dreamstate/types";

/**
 * Register context manager entry.
 */
export function registerService<S extends any = any>(
  Service: TAnyContextManagerConstructor,
  initialState?: S
): void {
  // Only if registry is empty -> create new instance, remember its context and save it to registry.
  if (!CONTEXT_SERVICES_REGISTRY.has(Service)) {
    const instance: InstanceType<TAnyContextManagerConstructor> = new Service(initialState);
    const signalHandler: TSignalListener = onMetadataSignalListenerCalled.bind(instance);

    CONTEXT_OBSERVERS_REGISTRY.set(Service, CONTEXT_OBSERVERS_REGISTRY.get(Service) || new Set());
    CONTEXT_SERVICES_REGISTRY.set(Service, instance);
    CONTEXT_SIGNAL_HANDLERS_REGISTRY.set(Service, signalHandler);
    CONTEXT_SERVICES_REFERENCES.set(Service, 0);

    subscribeToSignals(signalHandler);

    CONTEXT_SERVICES_ACTIVATED.add(Service);

    CONTEXT_STATES_REGISTRY.set(Service, (instance as ContextManager<TAnyObject>).context);
    // Subscribers are not always sync, should not block their un-sub later.
    CONTEXT_SUBSCRIBERS_REGISTRY.set(
      Service,
      CONTEXT_SUBSCRIBERS_REGISTRY.get(Service) || new Set()
    );

    // todo: Add checkContext method call for deb bundle with warnings for initial state nesting.
    processComputed((instance as ContextManager<any>).context);
  }
}
