import { CONTEXT_SERVICES_REGISTRY } from "@Lib/core/internals";
import { ContextService } from "@Lib/core/management/ContextService";
import { registerService as internalRegisterService } from "@Lib/core/registry/registerService";
import { TDreamstateService } from "@Lib/core/types";

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
