import { initializeScopeContext } from "@/dreamstate/core/scoping/initializeScopeContext";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { IContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Mock manager for isolated testing.
 *
 * @param {IContextManagerConstructor} ManagerClass - class reference of context manager that should be created.
 * @param {TAnyObject} initialState - initial state that should be injected in class constructor.
 * @param {IScopeContext} scope - optional scope context where manager should be mocked,
 *   in case of undefined new scope is created.
 * @returns InstanceType<IContextManagerConstructor> manager class instance.
 */
export function mockManager<T extends TAnyObject, S extends TAnyObject, M extends IContextManagerConstructor<T, S>>(
  ManagerClass: M,
  initialState?: S,
  scope: IScopeContext = initializeScopeContext()
): InstanceType<M> {
  scope.INTERNAL.registerService(ManagerClass, initialState);

  return scope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(ManagerClass) as InstanceType<M>;
}
