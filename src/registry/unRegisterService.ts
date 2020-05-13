import { TDreamstateService } from "../types";
import { unsubscribeFromSignals } from "../signals";
import {
  CONTEXT_SERVICES_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SERVICES_ACTIVATED
} from "../internals";

import { debug } from "../../cli/build/macroses/debug.macro";

export function unRegisterService<T extends object>(
  Service: TDreamstateService,
  forceUnregister: boolean = false
): void {
  // @ts-ignore
  if (!Service["IS_SINGLE"] || forceUnregister) {
    unsubscribeFromSignals(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(Service)!);

    CONTEXT_SERVICES_REGISTRY.delete(Service);
    CONTEXT_SIGNAL_HANDLERS_REGISTRY.delete(Service);
    // Do not check if it is CM - more expensive operation.
    CONTEXT_STATES_REGISTRY.delete(Service);
    // todo: If replace weak maps with maps, think about GC there. High probability of leak there?
    // Do not clean observers and subscribers, automated by react.

    // Delete possible context manager reference to prevent issues with GC.
    CONTEXT_SERVICES_ACTIVATED.delete(Service);

    debug.info("Context service instance disposed:", Service.name);
  } else {
    debug.info("Context service singleton should not be disposed:", Service.name);
  }
}
