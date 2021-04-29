import { CONTEXT_OBSERVERS_REGISTRY } from "@/dreamstate/core/internals";
import { TAnyContextManagerConstructor, TUpdateObserver } from "@/dreamstate/types";

/**
 * Remove state changes observer and kill instance if it is not singleton.
 */
export function removeServiceObserverFromRegistry(
  Service: TAnyContextManagerConstructor,
  observer: TUpdateObserver
): void {
  CONTEXT_OBSERVERS_REGISTRY.get(Service)!.delete(observer);
}
