import { IContextManagerConstructor, TUpdateSubscriber } from "../types";
import { CONTEXT_STATES_REGISTRY, CONTEXT_SUBSCRIBERS_REGISTRY, IDENTIFIER_KEY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Subscribe to manager updates/changes.
 * Callback will be fired after each state update.
 */
export function subscribeToManager<T extends object, D extends IContextManagerConstructor<T>>(
  managerConstructor: D,
  subscriber: TUpdateSubscriber<T>,
  loadCurrent: boolean = false
): void {
  CONTEXT_SUBSCRIBERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]].add(subscriber);

  log.info("Context manager subscriber added:", managerConstructor.name, loadCurrent);

  if (loadCurrent) {
    subscriber(CONTEXT_STATES_REGISTRY[managerConstructor[IDENTIFIER_KEY]]);
  }
}
