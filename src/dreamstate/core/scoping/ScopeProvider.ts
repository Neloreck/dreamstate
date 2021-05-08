import { createElement, ProviderProps, ReactElement, ReactNode, useState } from "react";

import { initializeScopeContext } from "@/dreamstate/core/scoping/initializeScopeContext";
import { IScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";

/**
 * Lazy initializer of current scope context provider props object that preserves object references.
 * Composes props object that will be same for each tree re-render.
 */
function scopeStateInitializer(): ProviderProps<IScopeContext> {
  return { value: initializeScopeContext() };
}

export interface IScopeProviderProps {
  children?: ReactNode;
}

/**
 * Dreamstate scope provider.
 * Ensures that signaling and context managers are isolated under this specific provider.
 *
 * @param {IScopeProviderProps} props - react component properties that contain provider children.
 *
 * @return {ReactElement} react tree element.
 */
export function ScopeProvider(props: IScopeProviderProps): ReactElement {
  const [ scopeContextProviderProps ] = useState(scopeStateInitializer);

  return createElement(ScopeContext.Provider, scopeContextProviderProps, props.children);
}

/**
 * Easier devtools usage for dev environment.
 */
if (IS_DEV) {
  ScopeProvider.displayName = "Dreamstate.ScopeProvider";
}
