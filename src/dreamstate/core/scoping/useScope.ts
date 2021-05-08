import { useContext } from "react";

import { IScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";

/**
 * Use current scope for current signaling/queries methods access.
 * Return bundle of functions that work with current scope and allow signals or queries processing.
 *
 * @return {IScopeContext} current scope in react tree.
 */
export function useScope(): IScopeContext {
  /**
   * Wrapper that encapsulates useContext + ScopeContext logic.
   */
  return useContext(ScopeContext);
}
