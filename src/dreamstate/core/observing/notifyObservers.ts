import {
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY
} from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import {
  IStringIndexed,
  TAnyContextManagerConstructor,
  TUpdateObserver,
  TUpdateSubscriber
} from "@/dreamstate/types";

/**
 * Notify observers and check if update is needed.
 */
export function notifyObservers<T extends IStringIndexed<any>>(
  manager: ContextManager<T>
): void {
  const nextContext: T = manager.context;

  CONTEXT_STATES_REGISTRY.set(manager.constructor as TAnyContextManagerConstructor, nextContext);
  CONTEXT_OBSERVERS_REGISTRY.get(manager.constructor as TAnyContextManagerConstructor)!
    .forEach(function(it: TUpdateObserver) {
      it();
    });
  /**
   * Async execution for subscribers.
   * There will be small amount of observers that work by the rules, but we cannot tell anything about subs.
   * Subscribers should not block code there with CPU usage/unhandled exceptions.
   */
  CONTEXT_SUBSCRIBERS_REGISTRY.get(manager.constructor as TAnyContextManagerConstructor)!
    .forEach(function(it: TUpdateSubscriber<T>) {
      setTimeout(it, 0, nextContext);
    });
}
