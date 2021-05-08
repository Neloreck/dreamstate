import { Context, createContext } from "react";

import { CONTEXT_REACT_CONTEXTS_REGISTRY } from "@/dreamstate/core/internals";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Get react context reference for provided ManagerClass.
 * Lazy internal creation only after first access attempt.
 */
export function getReactContext<
  T extends TAnyContextManagerConstructor
>(
  ManagerClass: T
): Context<T> {
  if (CONTEXT_REACT_CONTEXTS_REGISTRY.has(ManagerClass)) {
    return CONTEXT_REACT_CONTEXTS_REGISTRY.get(ManagerClass) as Context<T>;
  } else {
    const reactContext: Context<T> = createContext(null as any);

    /**
     * Later providers and consumers in tree will be displayed as
     * 'DS.Class.Provider' or 'DS.Class.Consumer'.
     */
    reactContext.displayName = "DS." + ManagerClass.name;

    CONTEXT_REACT_CONTEXTS_REGISTRY.set(ManagerClass, reactContext);

    return reactContext;
  }
}
