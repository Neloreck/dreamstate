import { createElement, Dispatch, ProviderProps, ReactElement, ReactNode, SetStateAction, useState } from "react";

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
 * @returns {ReactElement} react tree element.
 */
export function ScopeProvider(props: IScopeProviderProps): ReactElement {
  const scopeState: [ ProviderProps<IScopeContext>, Dispatch<SetStateAction<ProviderProps<IScopeContext>>> ]
    = useState(scopeStateInitializer);

  return createElement(ScopeContext.Provider, scopeState[0], props.children);
}

/**
 * Easier devtools usage for dev environment.
 */
if (IS_DEV) {
  ScopeProvider.displayName = "Dreamstate.ScopeProvider";
}
