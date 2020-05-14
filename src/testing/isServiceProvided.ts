import { TDreamstateService, TUpdateObserver } from "@Lib/types";
import { CONTEXT_OBSERVERS_REGISTRY } from "@Lib/internals";

/**
 * Check if current service is provided.
 */
export function isServiceProvided<T extends TDreamstateService>(
  Service: T
): boolean {
  const registry: Set<TUpdateObserver> | undefined = CONTEXT_OBSERVERS_REGISTRY.get(Service);

  return registry ? registry.size > 0 : false;
}
