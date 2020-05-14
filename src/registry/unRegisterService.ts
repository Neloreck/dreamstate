import { TDreamstateService } from "@Lib/types";
import { unsubscribeFromSignals } from "@Lib/signals/unsubscribeFromSignals";
import {
  CONTEXT_SERVICES_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SERVICES_ACTIVATED
} from "@Lib/internals";

import { debug } from "@Macro/debug.macro";

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
