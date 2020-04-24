import { IContextManagerConstructor } from "../types";
import { ContextManager } from "../management";
import { unsubscribeFromSignals } from "../signals";
import {
  CONTEXT_MANAGERS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  IDENTIFIER_KEY
} from "../internals";

import { log } from "../../build/macroses/log.macro";

export function unRegisterManager<T extends object>(
  managerConstructor: IContextManagerConstructor<T>,
  forceUnregister: boolean = false
): void {
  const instance: ContextManager<T> | undefined = CONTEXT_MANAGERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]];

  if (!instance) {
    log.error("Context manager failed to unregister:", managerConstructor.name);
    throw new Error("Could not find manager instance when unregister it.");
  } else {
    instance["onProvisionEnded"]();

    log.info("Context manager provision ended:", managerConstructor.name);

    // @ts-ignore
    if (!managerConstructor["IS_SINGLE"] || forceUnregister) {
      unsubscribeFromSignals(CONTEXT_SIGNAL_HANDLERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]]);

      delete CONTEXT_STATES_REGISTRY[managerConstructor[IDENTIFIER_KEY]];
      delete CONTEXT_MANAGERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]];
      delete CONTEXT_SIGNAL_HANDLERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]];

      log.info("Context manager instance disposed:", managerConstructor.name);
    } else {
      log.info("Context manager instance should not be disposed:", managerConstructor.name);
    }

    log.info("Context manager unregistered:", managerConstructor.name);
  }
}
