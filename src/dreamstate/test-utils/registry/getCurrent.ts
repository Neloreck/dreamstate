import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Get current manager instance from current scope.
 * Returns null if nothing is found.
 *
 * @param {TAnyContextManagerConstructor} ManagerClass - class reference of context manager.
 * @param {IScopeContext} scope - scope where manager should be found.
 * @returns manager class instance or null if it is not created in current scope.
 */
export function getCurrent<T extends TAnyContextManagerConstructor>(
  ManagerClass: T,
  scope: IScopeContext
): InstanceType<T> | null {
  return scope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(ManagerClass) as InstanceType<T>|| null;
}
