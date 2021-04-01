import { CONTEXT_SERVICES_REGISTRY } from "@/dreamstate/core/internals";
import { registerService as internalRegisterService } from "@/dreamstate/core/registry/registerService";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import { TAnyObject, TDreamstateService } from "@/dreamstate/types";

/**
 * Register service class.
 */
export function registerService<
  S extends TAnyObject,
  T extends TDreamstateService<S>
  >(
  Service: T,
  initialState?: S
): InstanceType<T> {
  if (!Service || !Service.prototype || !(Service.prototype instanceof ContextService)) {
    throw new TypeError("Cannot register invalid service. Expected class extending ContextService.");
  }

  internalRegisterService(Service, initialState);

  return CONTEXT_SERVICES_REGISTRY.get(Service) as InstanceType<T>;
}
