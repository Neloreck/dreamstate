import { IContextManagerConstructor, TUpdateSubscriber } from "../types";
import { CONTEXT_STATES_REGISTRY, CONTEXT_SUBSCRIBERS_REGISTRY } from "../internals";
import { ContextManager } from "../management";

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
  if (!(managerConstructor.prototype instanceof ContextManager)) {
    throw new TypeError("Cannot subscribe to class that does not extend ContextManager.");
  }

  CONTEXT_SUBSCRIBERS_REGISTRY.get(managerConstructor)!.add(subscriber);

  log.info("Context manager subscriber added:", managerConstructor.name, loadCurrent);

  if (loadCurrent) {
    subscriber(CONTEXT_STATES_REGISTRY.get(managerConstructor) as T);
  }
}
