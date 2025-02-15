import { Provider } from "react";

import { IScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";

/**
 * Creates a mock scope provider with an initial clean state.
 * This can be used to mock the entire scope context in a React tree.
 *
 * Must be used together with the `mockScope` method to ensure that the `value` property
 * of `ScopeContext.Provider` is correctly set.
 *
 * @returns {Provider<IScopeContext>} A `ScopeContext.Provider` component for React rendering.
 */
export function mockScopeProvider(): Provider<IScopeContext> {
  return ScopeContext.Provider;
}
