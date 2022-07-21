import { Context, createContext } from "react";

import { CONTEXT_REACT_CONTEXTS_REGISTRY } from "@/dreamstate/core/internals";
import { IContextManagerConstructor } from "@/dreamstate/types";

/**
 * Get react context reference for provided ManagerClass.
 * Lazy internal creation only after first access attempt.
 *
 * @param ManagerClass - context manager constructor reference.
 * @param defaultContext - default context value to be applied if manager is not provided.
 * @returns {Context} react context instance with pre-defined default value.
 */
export function getReactContext<S, M extends IContextManagerConstructor<S>>(
  ManagerClass: M,
  defaultContext: Partial<S> | null = null
): Context<S> {
  if (CONTEXT_REACT_CONTEXTS_REGISTRY.has(ManagerClass)) {
    return CONTEXT_REACT_CONTEXTS_REGISTRY.get(ManagerClass) as Context<S>;
  } else {
    const reactContext: Context<S> = createContext(defaultContext as S);

    /**
     * Later providers and consumers in tree will be displayed as
     * 'DS.Class.Provider' or 'DS.Class.Consumer'.
     */
    reactContext.displayName = "DS." + ManagerClass.name;

    CONTEXT_REACT_CONTEXTS_REGISTRY.set(ManagerClass, reactContext);

    return reactContext;
  }
}
