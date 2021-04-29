import {
  CONTEXT_SERVICES_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SERVICES_ACTIVATED
} from "@/dreamstate/core/internals";
import { unsubscribeFromSignals } from "@/dreamstate/core/signals/unsubscribeFromSignals";
import { TAnyObject, TDreamstateService } from "@/dreamstate/types";

export function unRegisterService<T extends TAnyObject>(
  Service: TDreamstateService<T>
): void {
  unsubscribeFromSignals(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(Service)!);

  CONTEXT_SERVICES_REGISTRY.delete(Service);
  CONTEXT_SIGNAL_HANDLERS_REGISTRY.delete(Service);
  CONTEXT_STATES_REGISTRY.delete(Service);

  CONTEXT_SERVICES_ACTIVATED.delete(Service);
  // Do not clean observers and subscribers, automated by react.
}
