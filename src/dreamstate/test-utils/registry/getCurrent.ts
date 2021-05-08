import { IPublicScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Get current manager instance from current scope.
 * Returns null if nothing is found.
 *
 * @param {TAnyContextManagerConstructor} ManagerClass - class reference of context manager.
 * @param {IPublicScopeContext} scope - scope where manager should be found.
 *
 * @return manager class instance or null if it is not created in current scope.
 */
export function getCurrent<T extends TAnyContextManagerConstructor>(
  ManagerClass: T,
  scope: IPublicScopeContext
): InstanceType<T> | null {
  return scope.REGISTRY.CONTEXT_SERVICES_REGISTRY.get(ManagerClass) as InstanceType<T>|| null;
}
