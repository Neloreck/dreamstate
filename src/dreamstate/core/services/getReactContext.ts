import { Context, createContext } from "react";

import { CONTEXT_REACT_CONTEXTS_REGISTRY } from "@/dreamstate/core/internals";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Get manager react context internal.
 */
export function getReactContext<
  T extends TAnyContextManagerConstructor
>(
  Manager: T
): Context<T> {
  if (CONTEXT_REACT_CONTEXTS_REGISTRY.has(Manager)) {
    return CONTEXT_REACT_CONTEXTS_REGISTRY.get(Manager)!;
  } else {
    const reactContext: Context<T> = createContext(null as any);

    reactContext.displayName = "DS." + Manager.name;

    CONTEXT_REACT_CONTEXTS_REGISTRY.set(Manager, reactContext);

    return reactContext;
  }
}
