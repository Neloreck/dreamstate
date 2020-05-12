import { Context, createContext } from "react";

import { TAnyContextManagerConstructor } from "../types";
import { CONTEXT_REACT_CONTEXTS_REGISTRY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Get manager react context internal.
 */
export function getReactContext<T extends TAnyContextManagerConstructor>(
  Manager: T
): Context<T> {
  log.info("Requested manager react context:", Manager.name);

  if (CONTEXT_REACT_CONTEXTS_REGISTRY.has(Manager)) {
    return CONTEXT_REACT_CONTEXTS_REGISTRY.get(Manager)!;
  } else {
    const reactContext: Context<T> = createContext(null as any);

    reactContext.displayName = "DS." + Manager.name;

    CONTEXT_REACT_CONTEXTS_REGISTRY.set(Manager, reactContext);

    log.info("Context manager context declared:", Manager.name, reactContext.displayName);

    return reactContext;
  }
}
