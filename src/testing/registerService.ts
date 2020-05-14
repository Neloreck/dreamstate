import { TDreamstateService } from "@Lib/types";
import { registerService as internalRegisterService } from "@Lib/registry/registerService";
import { CONTEXT_SERVICES_REGISTRY } from "@Lib/internals";
import { ContextService } from "@Lib/management/ContextService";

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
