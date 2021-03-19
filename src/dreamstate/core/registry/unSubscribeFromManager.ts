import { CONTEXT_SUBSCRIBERS_REGISTRY } from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { IContextManagerConstructor, TAnyObject, TUpdateSubscriber } from "@/dreamstate/types";

/**
 * Unsubscribe from manager updates.
 */
export function unsubscribeFromManager<T extends TAnyObject, D extends IContextManagerConstructor<T>>(
  Manager: D,
  subscriber: TUpdateSubscriber<T>
): void {
  if (!(Manager.prototype instanceof ContextManager)) {
    throw new TypeError("Cannot unsubscribe from class that does not extend ContextManager.");
  }

  CONTEXT_SUBSCRIBERS_REGISTRY.get(Manager)!.delete(subscriber);
}
