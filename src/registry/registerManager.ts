import { IContextManagerConstructor } from "../types";
import { ContextManager } from "../management";
import { onMetadataSignalListenerCalled, subscribeToSignals } from "../signals";
import {
  CONTEXT_MANAGERS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  IDENTIFIER_KEY,
} from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Register context manager entry.
 */
export function registerManager<T extends object>(
  managerConstructor: IContextManagerConstructor<T>,
): void {
  // Only if registry is empty -> create new instance, remember its context and save it to registry.
  if (
    !Object.prototype.hasOwnProperty.call(managerConstructor, IDENTIFIER_KEY) ||
    !Object.prototype.hasOwnProperty.call(CONTEXT_MANAGERS_REGISTRY, managerConstructor[IDENTIFIER_KEY])
  ) {
    const instance: ContextManager<T> = new managerConstructor();

    CONTEXT_STATES_REGISTRY[managerConstructor[IDENTIFIER_KEY]] = instance.context;
    CONTEXT_MANAGERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]] = instance;
    CONTEXT_SIGNAL_HANDLERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]]
      = onMetadataSignalListenerCalled.bind(instance);

    subscribeToSignals(CONTEXT_SIGNAL_HANDLERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]]);

    log.info("Context manager registered:", managerConstructor.name);
  } else {
    log.info("Context manager already registered, continue with old instance:", managerConstructor.name);
  }
}
