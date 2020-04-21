import { IContextManagerConstructor, TUpdateSubscriber } from "../types";
import { CONTEXT_SUBSCRIBERS_REGISTRY, IDENTIFIER_KEY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Unsubscribe from manager updates.
 */
export function unsubscribeFromManager<T extends object, D extends IContextManagerConstructor<T>>(
  managerConstructor: D,
  subscriber: TUpdateSubscriber<T>
): void {
  log.info("Context manager subscriber removed:", managerConstructor.name);

  CONTEXT_SUBSCRIBERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]].delete(subscriber);
}
