import {
  IDENTIFIER_KEY,
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY
} from "../internals";
import { IContextManagerConstructor, IStringIndexed, TUpdateObserver, TUpdateSubscriber } from "../types";
import { ContextManager } from "../management";

import { log } from "../../build/macroses/log.macro";

/**
 * Notify observers and check if update is needed.
 */
export function notifyObservers<T extends IStringIndexed<any>>(manager: ContextManager<T>): void {
  const nextContext: T = manager.context;

  log.info(
    "Context manager notify observers and subscribers:",
    manager.constructor.name,
    CONTEXT_OBSERVERS_REGISTRY[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]].size,
    CONTEXT_SUBSCRIBERS_REGISTRY[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]].size
  );

  CONTEXT_STATES_REGISTRY[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]] = nextContext;
  CONTEXT_OBSERVERS_REGISTRY[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]]
    .forEach(function(it: TUpdateObserver) { it(); });
  /**
   * Async execution for subscribers.
   * There will be small amount of observers that work by the rules, but we cannot tell anything about subs.
   * Subscribers should not block code there with CPU usage/unhandled exceptions.
   */
  CONTEXT_SUBSCRIBERS_REGISTRY[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]].
    forEach(function(it: TUpdateSubscriber<T>) {
      setTimeout(it, 0, nextContext);
    });
}
