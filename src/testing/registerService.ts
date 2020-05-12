import { TDreamstateService } from "../types";
import { ContextService } from "../";
import { registerService as internalRegisterService } from "../registry";
import { CONTEXT_SERVICES_REGISTRY } from "../internals";

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
