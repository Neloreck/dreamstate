import { Context, createContext } from "react";

import { TAnyContextManagerConstructor } from "../types";
import { CONTEXT_REACT_CONTEXTS_REGISTRY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Get manager react context internal.
 */
export function getReactContext<T extends TAnyContextManagerConstructor>(
  managerConstructor: T
): Context<T> {
  log.info("Requested manager react context:", managerConstructor.name);

  if (CONTEXT_REACT_CONTEXTS_REGISTRY.has(managerConstructor)) {
    return CONTEXT_REACT_CONTEXTS_REGISTRY.get(managerConstructor)!;
  } else {
    const reactContext: Context<T> = createContext(null as any);

    reactContext.displayName = "DS." + managerConstructor.name;

    CONTEXT_REACT_CONTEXTS_REGISTRY.set(managerConstructor, reactContext);

    log.info("Context manager context declared:", managerConstructor.name, reactContext.displayName);

    return reactContext;
  }
}
