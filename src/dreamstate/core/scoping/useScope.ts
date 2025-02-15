import { useContext } from "react";

import { IScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";

/**
 * Custom hook that retrieves the current scope context.
 * This hook provides access to the current scope in the React tree. It returns a bundle of
 * functions and data that allow for processing data, signals and queries within that scope.
 *
 * @returns {IScopeContext} The current scope context in the React tree.
 */
export function useScope(): IScopeContext {
  return useContext(ScopeContext);
}
