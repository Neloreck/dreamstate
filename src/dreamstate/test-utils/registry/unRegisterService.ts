import { unRegisterService as internalUnRegisterService } from "@/dreamstate/core/registry/unRegisterService";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import { TDreamstateService } from "@/dreamstate/types";

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
