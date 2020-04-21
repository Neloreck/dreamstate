import { IContextManagerConstructor, TUpdateObserver, } from "../types";
import { CONTEXT_MANAGERS_REGISTRY, CONTEXT_OBSERVERS_REGISTRY, IDENTIFIER_KEY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Add state changes observer.
 */
export function addManagerObserverToRegistry<T extends object>(
  managerConstructor: IContextManagerConstructor<T>,
  observer: TUpdateObserver
): void {
  CONTEXT_OBSERVERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]].add(observer);

  log.info("Context manager observer added:", managerConstructor.name);

  // Notify about provision, if it is first observer.
  if (CONTEXT_OBSERVERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]].size === 1) {
    log.info("Context manager provision started:", managerConstructor.name);
    CONTEXT_MANAGERS_REGISTRY[managerConstructor[IDENTIFIER_KEY]]["onProvisionStarted"]();
  }
}
