import { createElement, Dispatch, ProviderProps, ReactElement, ReactNode, SetStateAction, useState } from "react";

import { initializeScopeContext } from "@/dreamstate/core/scoping/initializeScopeContext";
import { IScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";

/**
 * Lazy initializer of current scope context provider props object that preserves object references.
 * Composes props object that will be same for each tree re-render.
 *
 * @returns {ProviderProps<IScopeContext>} The initialized props object for the scope provider.
 */
function scopeStateInitializer(): ProviderProps<IScopeContext> {
  return { value: initializeScopeContext() };
}

export interface IScopeProviderProps {
  children?: ReactNode;
}

/**
 * Provides an isolated scope for signaling and context managers.
 *
 * The `ScopeProvider` component wraps its children within a dedicated scope, ensuring that signals
 * and context managers operate independently from other parts of the React tree. This isolation
 * helps prevent interference between different parts of the application and maintains the integrity
 * of context data and signal handling.
 *
 * @param {IScopeProviderProps} props - The properties for the scope provider, including the children
 *   to be rendered within the isolated scope.
 * @returns {ReactElement} A React element representing the scope provider.
 */
export function ScopeProvider(props: IScopeProviderProps): ReactElement {
  const scopeState: [ProviderProps<IScopeContext>, Dispatch<SetStateAction<ProviderProps<IScopeContext>>>] =
    useState(scopeStateInitializer);

  return createElement(ScopeContext.Provider, scopeState[0], props.children);
}

/*
 * Easier devtools usage for dev environment.
 */
if (IS_DEV) {
  ScopeProvider.displayName = "Dreamstate.ScopeProvider";
}
