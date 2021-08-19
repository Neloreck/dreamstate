import { initializeScopeContext } from "@/dreamstate/core/scoping/initializeScopeContext";
import { createRegistry, IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";

/**
 * Mock scope with clean initial state.
 * Can be used to mock whole scope context and run some advanced tests.
 *
 * @param {IRegistry} registry - optional custom registry that will be used as scope storage.
 * @returns {IScopeContext} mocked scope context.
 */
export function mockScope(registry: IRegistry = createRegistry()): IScopeContext {
  return initializeScopeContext(registry);
}
