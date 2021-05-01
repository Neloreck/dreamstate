import {
  CONTEXT_SERVICES_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SERVICES_ACTIVATED
} from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { unsubscribeFromSignals } from "@/dreamstate/core/signals/unsubscribeFromSignals";
import { IContextManagerConstructor } from "@/dreamstate/types";

function throwAfterDisposal(): never {
  throw new Error("Disposed context are not supposed to access signaling scope.");
}

export function unRegisterService<T extends IContextManagerConstructor<any, any>>(
  Service: T
): void {
  // Block instance from calling this.* signaling methods after disposing.
  if (CONTEXT_SERVICES_REGISTRY.has(Service)) {
    const instance: ContextManager<any> = CONTEXT_SERVICES_REGISTRY.get(Service) as ContextManager<any>;

    instance["emitSignal"] = throwAfterDisposal;
    instance["queryDataSync"] = throwAfterDisposal;
    instance["queryDataAsync"] = throwAfterDisposal;
  }

  unsubscribeFromSignals(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(Service)!);

  CONTEXT_SERVICES_REGISTRY.delete(Service);
  CONTEXT_SIGNAL_HANDLERS_REGISTRY.delete(Service);
  CONTEXT_STATES_REGISTRY.delete(Service);

  CONTEXT_SERVICES_ACTIVATED.delete(Service);
  // Do not clean observers and subscribers, automated by react.}
}
