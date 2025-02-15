import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Retrieves the current instance of a context manager from the given scope.
 * Returns `null` if the manager is not found in the current scope.
 *
 * @template T - The type of the context manager constructor.
 * @param {T} ManagerClass - The constructor reference of the context manager to retrieve.
 * @param {IScopeContext} scope - The scope in which to search for the manager instance.
 * @returns {InstanceType<T> | null} The instance of the specified manager class if found, otherwise `null`.
 */
export function getCurrent<T extends TAnyContextManagerConstructor>(
  ManagerClass: T,
  scope: IScopeContext
): InstanceType<T> | null {
  return (scope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(ManagerClass) as InstanceType<T>) || null;
}
