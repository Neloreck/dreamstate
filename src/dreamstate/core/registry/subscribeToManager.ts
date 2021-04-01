import { CONTEXT_SUBSCRIBERS_REGISTRY } from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { IContextManagerConstructor, TAnyObject, TUpdateSubscriber } from "@/dreamstate/types";

/**
 * Subscribe to manager updates/changes.
 * Callback will be fired after each state update.
 */
export function subscribeToManager<
  T extends TAnyObject,
  D extends IContextManagerConstructor<T, any>
>(
  Manager: D,
  subscriber: TUpdateSubscriber<T>
): void {
  if (!(Manager.prototype instanceof ContextManager)) {
    throw new TypeError("Cannot subscribe to class that does not extend ContextManager.");
  }

  CONTEXT_SUBSCRIBERS_REGISTRY.get(Manager)!.add(subscriber);
}
