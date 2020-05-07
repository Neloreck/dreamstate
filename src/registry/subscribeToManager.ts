import { IContextManagerConstructor, TUpdateSubscriber } from "../types";
import { CONTEXT_SUBSCRIBERS_REGISTRY } from "../internals";
import { ContextManager } from "../management/ContextManager";

import { log } from "../../build/macroses/log.macro";

/**
 * Subscribe to manager updates/changes.
 * Callback will be fired after each state update.
 */
export function subscribeToManager<T extends object, D extends IContextManagerConstructor<T>>(
  managerConstructor: D,
  subscriber: TUpdateSubscriber<T>
): void {
  if (!(managerConstructor.prototype instanceof ContextManager)) {
    throw new TypeError("Cannot subscribe to class that does not extend ContextManager.");
  }

  CONTEXT_SUBSCRIBERS_REGISTRY.get(managerConstructor)!.add(subscriber);

  log.info("Context manager subscriber added:", managerConstructor.name);
}
