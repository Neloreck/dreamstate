import { Provider } from "react";

import { IScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";

/**
 * Mock scope with initial clean state.
 * Can be used to mock whole scope context.
 *
 * Should be used in pair with 'mockScope' method so 'value' property of ScopeContext.Provider will be correct.
 *
 * @returns {Provider} ScopeContext.Provider component for react rendering.
 */
export function mockScopeProvider(): Provider<IScopeContext> {
  return ScopeContext.Provider;
}
