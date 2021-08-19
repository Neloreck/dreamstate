import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { mockScope } from "@/dreamstate/test-utils/registry/mockScope";
import { IContextManagerConstructor, TAnyObject, TManagerInstanceMap } from "@/dreamstate/types";

/**
 * Mock managers and scope for isolated testing.
 * Returns scope where all managers are registered and can be found with 'getCurrent' test util.
 * Intended to be used when some managers should be paired together for specific test cases.
 *
 * @param {IContextManagerConstructor} managerClasses - class reference of context manager that should be created.
 * @param {TAnyObject} initialState - initial state that should be injected in class constructor.
 * @param {IScopeContext} scope - scope where managers should be mocked, mocked by default.
 * @returns array with manager class instance and mocked scope context object.
 */
export function mockManagers<
  T extends TAnyObject,
  S extends TAnyObject,
  M extends IContextManagerConstructor<T, S>,
  E extends Array<M>
>(managerClasses: E, initialState?: S | null, scope: IScopeContext = mockScope()): TManagerInstanceMap {
  for (let it = 0; it < managerClasses.length; it ++) {
    scope.INTERNAL.registerService(managerClasses[it], initialState);
  }

  return new Map(scope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY);
}
