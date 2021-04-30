import { CONTEXT_OBSERVERS_REGISTRY } from "@/dreamstate/core/internals";
import {
  IContextManagerConstructor,
  TAnyObject,
  TUpdateObserver
} from "@/dreamstate/types";

/**
 * Add state changes observer.
 */
export function addServiceObserverToRegistry<T extends TAnyObject = TAnyObject>(
  Service: IContextManagerConstructor<T, TAnyObject>,
  observer: TUpdateObserver<T>
): void {
  CONTEXT_OBSERVERS_REGISTRY.get(Service)!.add(observer);
}
