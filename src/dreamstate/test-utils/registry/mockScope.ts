import { initializeScopeContext } from "@/dreamstate/core/scoping/initializeScopeContext";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";

/**
 * Mock scope with initial clean state.
 * Can be used to mock whole scope context.
 */
export function mockScope(): IScopeContext {
  return initializeScopeContext();
}
