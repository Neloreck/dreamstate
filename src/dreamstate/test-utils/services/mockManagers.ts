import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { mockScope } from "@/dreamstate/test-utils/registry/mockScope";
import { IContextManagerConstructor, TAnyObject, TManagerInstanceMap } from "@/dreamstate/types";

/**
 * Mocks multiple context managers and a scope for isolated testing.
 *
 * This is useful when multiple managers need to be paired together for specific test cases.
 *
 * @template T - The type of the manager's state.
 * @template S - The type of the initial state injected into each manager.
 * @template M - The type of a single context manager constructor.
 * @param {M[]} managerClasses - An array of context manager constructor references to be created.
 * @param {S | null} initialState - An optional initial state to inject into each manager's constructor.
 * @param {IScopeContext} [scope=mockScope()] - The scope where managers should be mocked. A mocked scope is
 *   used by default.
 * @returns {TManagerInstanceMap} A mapping of manager instances along with the mocked scope context.
 */
export function mockManagers<T extends TAnyObject, S extends TAnyObject, M extends IContextManagerConstructor<T, S>>(
  managerClasses: Array<M>,
  initialState?: S | null,
  scope: IScopeContext = mockScope()
): TManagerInstanceMap {
  for (let it = 0; it < managerClasses.length; it ++) {
    scope.INTERNAL.registerService(managerClasses[it], initialState);
  }

  return new Map(scope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY);
}
