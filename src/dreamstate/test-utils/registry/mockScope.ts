import { initializeScopeContext } from "@/dreamstate/core/scoping/initializeScopeContext";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";

/**
 * Mock scope with clean initial state.
 * Can be used to mock whole scope context and run some advanced tests.
 *
 * @returns {IScopeContext} mocked scope context.
 */
export function mockScope(): IScopeContext {
  return initializeScopeContext();
}
