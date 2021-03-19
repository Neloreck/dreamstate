import { CONTEXT_OBSERVERS_REGISTRY } from "@/dreamstate/core/internals";
import { TDreamstateService, TUpdateObserver } from "@/dreamstate/types";

/**
 * Add state changes observer.
 */
export function addServiceObserverToRegistry(
  Service: TDreamstateService,
  observer: TUpdateObserver
): void {
  CONTEXT_OBSERVERS_REGISTRY.get(Service)!.add(observer);
}
