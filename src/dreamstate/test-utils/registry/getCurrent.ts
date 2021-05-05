import { IPublicScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Get current manager instance from current scope.
 * Returns null if nothing is found.
 */
export function getCurrent<T extends TAnyContextManagerConstructor>(
  Service: T,
  scope: IPublicScopeContext
): InstanceType<T> | null {
  return scope.REGISTRY.CONTEXT_SERVICES_REGISTRY.get(Service) as InstanceType<T>|| null;
}
