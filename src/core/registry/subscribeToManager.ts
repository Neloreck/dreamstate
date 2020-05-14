import { CONTEXT_SUBSCRIBERS_REGISTRY } from "@Lib/core/internals";
import { ContextManager } from "@Lib/core/management/ContextManager";
import { IContextManagerConstructor, TUpdateSubscriber } from "@Lib/core/types";

import { debug } from "@Macro/debug.macro";

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
