import { initializeScopeContext } from "@/dreamstate/core/scoping/initializeScopeContext";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { IContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Mock managers and scope for isolated testing.
 * Returns scope where all managers are registered and can be found with 'getCurrent' test util.
 * Intended to be used when some managers should be paired together for specific test cases.
 *
 * @param {IContextManagerConstructor} managerClasses - class reference of context manager that should be created.
 * @param {TAnyObject} initialState - initial state that should be injected in class constructor.
 * @returns array with manager class instance and mocked scope context object.
 */
export function mockManagersInScope<
  T extends TAnyObject,
  S extends TAnyObject,
  M extends IContextManagerConstructor<T, S>,
  E extends Array<M>
>(managerClasses: E, initialState?: S): IScopeContext {
  const scope: IScopeContext = initializeScopeContext();

  for (let it = 0; it < managerClasses.length; it ++) {
    scope.INTERNAL.registerService(managerClasses[it], initialState);
  }

  return scope;
}
