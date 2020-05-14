import { IContextManagerConstructor, TUpdateSubscriber } from "@Lib/types";
import { CONTEXT_SUBSCRIBERS_REGISTRY } from "@Lib/internals";
import { ContextManager } from "@Lib/management/ContextManager";

import { debug } from "@Macro/debug.macro";

/**
 * Unsubscribe from manager updates.
 */
export function unsubscribeFromManager<T extends object, D extends IContextManagerConstructor<T>>(
  Manager: D,
  subscriber: TUpdateSubscriber<T>
): void {
  if (!(Manager.prototype instanceof ContextManager)) {
    throw new TypeError("Cannot unsubscribe from class that does not extend ContextManager.");
  }

  debug.info("Context manager subscriber removed:", Manager.name);

  CONTEXT_SUBSCRIBERS_REGISTRY.get(Manager)!.delete(subscriber);
}
