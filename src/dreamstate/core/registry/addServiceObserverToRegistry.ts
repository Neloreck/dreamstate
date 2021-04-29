import { CONTEXT_OBSERVERS_REGISTRY } from "@/dreamstate/core/internals";
import { TAnyContextManagerConstructor, TUpdateObserver } from "@/dreamstate/types";

/**
 * Add state changes observer.
 */
export function addServiceObserverToRegistry(
  Service: TAnyContextManagerConstructor,
  observer: TUpdateObserver
): void {
  CONTEXT_OBSERVERS_REGISTRY.get(Service)!.add(observer);
}
