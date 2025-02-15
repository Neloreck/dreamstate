import { initializeScopeContext } from "@/dreamstate/core/scoping/initializeScopeContext";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { IContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Mocks a context manager for isolated testing.
 *
 * @template T - The type of the manager's state.
 * @template S - The type of the initial state injected into the manager.
 * @template M - The type of the context manager constructor.
 * @param {M} ManagerClass - The constructor reference of the context manager to be created.
 * @param {S | null} initialState - An optional initial state to inject into the manager's constructor.
 * @param {IScopeContext} [scope] - An optional scope context where the manager
 *   should be mocked. If not provided, a new scope is created.
 * @returns {InstanceType<M>} The instance of the mocked manager.
 */
export function mockManager<T extends TAnyObject, S extends TAnyObject, M extends IContextManagerConstructor<T, S>>(
  ManagerClass: M,
  initialState?: S | null,
  scope: IScopeContext = initializeScopeContext()
): InstanceType<M> {
  scope.INTERNAL.registerService(ManagerClass, initialState);

  return scope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(ManagerClass) as InstanceType<M>;
}
