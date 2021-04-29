import { unRegisterService as internalUnRegisterService } from "@/dreamstate/core/registry/unRegisterService";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import { TAnyContextServiceConstructor } from "@/dreamstate/types";

/**
 * Unregister service.
 */
export function unRegisterService(
  Service: TAnyContextServiceConstructor
): void {
  if (!Service || !Service.prototype || !(Service.prototype instanceof ContextService)) {
    throw new TypeError("Cannot register invalid service. Expected class extending ContextService.");
  }

  internalUnRegisterService(Service);
}
