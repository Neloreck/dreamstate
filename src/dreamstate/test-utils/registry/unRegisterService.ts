import { unRegisterService as internalUnRegisterService } from "@/dreamstate/core/registry/unRegisterService";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Unregister service.
 */
export function unRegisterService(
  Service: TAnyContextManagerConstructor
): void {
  if (!Service || !Service.prototype || !(Service.prototype instanceof ContextManager)) {
    throw new TypeError("Cannot register invalid service. Expected class extending ContextManager.");
  }

  internalUnRegisterService(Service);
}
