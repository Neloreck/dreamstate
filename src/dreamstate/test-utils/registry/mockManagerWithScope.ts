import { initializeScopeContext } from "@/dreamstate/core/scoping/initializeScopeContext";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { IContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Mock manager and scope for isolated testing.
 */
export function mockManagerWithScope<
  T extends TAnyObject, S extends TAnyObject, M extends IContextManagerConstructor<T, S>
>(Manager: M, initialState?: S): [ InstanceType<M>, IScopeContext ] {
  const scope = initializeScopeContext();

  scope.registerService(Manager, initialState);

  return [ scope.REGISTRY.CONTEXT_SERVICES_REGISTRY.get(Manager) as InstanceType<M>, scope ];
}
