import { initializeScopeContext } from "@/dreamstate/core/scoping/initializeScopeContext";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { IContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Mock manager and scope for isolated testing.
 *
 * @param {IContextManagerConstructor} ManagerClass - class reference of context manager that should be created.
 * @param {TAnyObject} initialState - initial state that should be injected in class constructor.
 *
 * @return tuple with manager class instance and mocked scope context object.
 */
export function mockManagerWithScope<
  T extends TAnyObject,
  S extends TAnyObject,
  M extends IContextManagerConstructor<T, S>
>(
  ManagerClass: M,
  initialState?: S
): [ InstanceType<M>, IScopeContext ] {
  const scope = initializeScopeContext();

  scope.registerService(ManagerClass, initialState);

  return [ scope.REGISTRY.CONTEXT_SERVICES_REGISTRY.get(ManagerClass) as InstanceType<M>, scope ];
}
