import { IContextManagerConstructor, TUpdateSubscriber } from "../types";
import { CONTEXT_SUBSCRIBERS_REGISTRY } from "../internals";
import { ContextManager } from "../management/ContextManager";

import { debug } from "../../cli/build/macroses/debug.macro";

/**
 * Subscribe to manager updates/changes.
 * Callback will be fired after each state update.
 */
export function subscribeToManager<T extends object, D extends IContextManagerConstructor<T>>(
  Manager: D,
  subscriber: TUpdateSubscriber<T>
): void {
  if (!(Manager.prototype instanceof ContextManager)) {
    throw new TypeError("Cannot subscribe to class that does not extend ContextManager.");
  }

  CONTEXT_SUBSCRIBERS_REGISTRY.get(Manager)!.add(subscriber);

  debug.info("Context manager subscriber added:", Manager.name);
}
