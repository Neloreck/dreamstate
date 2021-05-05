import { createElement, ReactChild, ReactElement, useState } from "react";

import { initializeScopeContext } from "@/dreamstate/core/scoping/initializeScopeContext";
import { ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";

export interface IScopeProviderProps {
  children?: ReactChild;
}

/**
 * Dreamstate scope provider.
 * Ensures that signaling and context managers are isolated under this specific provider.
 */
export function ScopeProvider(props: IScopeProviderProps): ReactElement {
  const [ scope ] = useState(initializeScopeContext);

  return createElement(ScopeContext.Provider, { value: scope }, props.children);
}

if (IS_DEV) {
  ScopeProvider.displayName = "Dreamstate.ScopeProvider";
}
