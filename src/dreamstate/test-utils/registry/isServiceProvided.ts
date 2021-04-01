import { CONTEXT_OBSERVERS_REGISTRY } from "@/dreamstate/core/internals";
import { TAnyObject, TDreamstateService, TUpdateObserver } from "@/dreamstate/types";

/**
 * Check if current service is provided.
 */
export function isServiceProvided<S extends TAnyObject, T extends TDreamstateService<S>>(
  Service: T
): boolean {
  const registry: Set<TUpdateObserver> | undefined = CONTEXT_OBSERVERS_REGISTRY.get(Service);

  return registry ? registry.size > 0 : false;
}
