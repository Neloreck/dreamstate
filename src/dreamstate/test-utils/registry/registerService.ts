import { CONTEXT_SERVICES_REGISTRY } from "@/dreamstate/core/internals";
import { registerService as internalRegisterService } from "@/dreamstate/core/registry/registerService";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { TAnyObject, TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Register service class.
 */
export function registerService<
  S extends TAnyObject,
  T extends TAnyContextManagerConstructor
  >(
  Service: T,
  initialState?: S
): InstanceType<T> {
  if (!Service || !Service.prototype || !(Service.prototype instanceof ContextManager)) {
    throw new TypeError("Cannot register invalid service. Expected class extending ContextManager.");
  }

  internalRegisterService(Service, initialState);

  return CONTEXT_SERVICES_REGISTRY.get(Service) as InstanceType<T>;
}
