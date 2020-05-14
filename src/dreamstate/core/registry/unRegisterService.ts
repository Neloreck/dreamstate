import { debug } from "@/macroses/debug.macro";

import {
  CONTEXT_SERVICES_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SERVICES_ACTIVATED
} from "@/dreamstate/core/internals";
import { unsubscribeFromSignals } from "@/dreamstate/signals/unsubscribeFromSignals";
import { TDreamstateService } from "@/dreamstate/types";

export function unRegisterService<T extends object>(
  Service: TDreamstateService,
  forceUnregister: boolean = false
): void {
  // @ts-ignore
  if (!Service["IS_SINGLE"] || forceUnregister) {
    unsubscribeFromSignals(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(Service)!);

    CONTEXT_SERVICES_REGISTRY.delete(Service);
    CONTEXT_SIGNAL_HANDLERS_REGISTRY.delete(Service);
    CONTEXT_STATES_REGISTRY.delete(Service);

    // Do not clean observers and subscribers, automated by react.

    CONTEXT_SERVICES_ACTIVATED.delete(Service);

    debug.info("Context service instance disposed:", Service.name);
  } else {
    debug.info("Context service singleton should not be disposed:", Service.name);
  }
}
