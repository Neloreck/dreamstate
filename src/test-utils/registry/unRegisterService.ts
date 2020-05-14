import { ContextService } from "@Lib/core/management/ContextService";
import { unRegisterService as internalUnRegisterService } from "@Lib/core/registry/unRegisterService";
import { TDreamstateService } from "@Lib/core/types";

/**
 * Unregister service.
 */
export function unRegisterService<T extends TDreamstateService>(
  Service: T,
  forceUnregister: boolean = true
): void {
  if (!Service || !Service.prototype || !(Service.prototype instanceof ContextService)) {
    throw new TypeError("Cannot register invalid service. Expected class extending ContextService.");
  }

  internalUnRegisterService(Service, forceUnregister);
}
