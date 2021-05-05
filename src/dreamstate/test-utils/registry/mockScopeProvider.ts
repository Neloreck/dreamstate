import { Provider } from "react";

import { IScopeContext, ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";

/**
 * Mock scope with initial clean state.
 * Can be used to mock whole scope context.
 */
export function mockScopeProvider(): Provider<IScopeContext> {
  return ScopeContext.Provider;
}
