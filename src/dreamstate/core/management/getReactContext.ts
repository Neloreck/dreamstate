import { Context, createContext } from "react";

import { CONTEXT_REACT_CONTEXTS_REGISTRY } from "@/dreamstate/core/internals";
import { IContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Retrieves the React context reference associated with the provided `ManagerClass`.
 * The context is lazily created only after the first access attempt. If no manager is provided in the scope,
 * a default context value can be applied.
 *
 * This function allows for the dynamic creation and retrieval of a context specific to a given manager,
 * ensuring that the context is properly initialized and available for use.
 *
 * @template S - The type of the context state.
 * @template M - The type of the context manager constructor.
 * @param {M} ManagerClass - The context manager constructor reference used to identify the context.
 * @returns {Context<S>} - A React context instance with a pre-defined default value.
 */
export function getReactContext<S extends TAnyObject, M extends IContextManagerConstructor<S>>(
  ManagerClass: M
): Context<S> {
  if (CONTEXT_REACT_CONTEXTS_REGISTRY.has(ManagerClass)) {
    return CONTEXT_REACT_CONTEXTS_REGISTRY.get(ManagerClass) as Context<S>;
  } else {
    const reactContext: Context<S> = createContext(ManagerClass.getDefaultContext() as S);

    /*
     * Later providers and consumers in tree will be displayed as
     * 'DS.Class.Provider' or 'DS.Class.Consumer'.
     */
    reactContext.displayName = "DS." + ManagerClass.name;

    CONTEXT_REACT_CONTEXTS_REGISTRY.set(ManagerClass, reactContext);

    return reactContext;
  }
}
