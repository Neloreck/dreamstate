import { TDreamstateService } from "../types";
import { ContextService } from "..";
import { unRegisterService as internalUnRegisterService } from "../registry";

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
