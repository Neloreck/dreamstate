import { CONTEXT_SERVICES_REGISTRY } from "@/dreamstate/core/internals";
import { registerService as internalRegisterService } from "@/dreamstate/core/registry/registerService";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import { TDreamstateService } from "@/dreamstate/types";

/**
 * Register service class.
 */
export function registerService<T extends TDreamstateService>(
  Service: T
): InstanceType<T> {
  if (!Service || !Service.prototype || !(Service.prototype instanceof ContextService)) {
    throw new TypeError("Cannot register invalid service. Expected class extending ContextService.");
  }

  internalRegisterService(Service);

  return CONTEXT_SERVICES_REGISTRY.get(Service) as InstanceType<T>;
}
