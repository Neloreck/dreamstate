import { useContext } from "react";

import { IPublicScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";

/**
 * Use current scope to get access to current signaling/queries methods.
 * Return bundle of functions that work with current scope and allow signals or queries processing.
 */
export function useScope(): IPublicScopeContext {
  return useContext(ScopeContext);
}
