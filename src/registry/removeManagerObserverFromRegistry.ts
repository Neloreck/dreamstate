import { IContextManagerConstructor, TUpdateObserver } from "../types";
import { CONTEXT_OBSERVERS_REGISTRY, IDENTIFIER_KEY } from "../internals";
import { unRegisterManager } from "./unRegisterManager";

import { log } from "../../build/macroses/log.macro";

/**
 * Remove state changes observer and kill instance if it is not singleton.
 */
export function removeManagerObserverFromRegistry<T extends object>(
  managerConstructor: IContextManagerConstructor<T>,
  observer: TUpdateObserver
): void {
  // Remove observer.
  CONTEXT_OBSERVERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]].delete(observer);

  log.info("Context manager observer removed:", managerConstructor.name);

  if (CONTEXT_OBSERVERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]].size === 0) {
    unRegisterManager(managerConstructor);
  }
}
