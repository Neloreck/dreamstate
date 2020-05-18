import { SIGNAL_LISTENERS_REGISTRY } from "@/dreamstate/core/internals";
import { TSignalListener } from "@/dreamstate/types";

/**
 * Unsubscribe from all signals and listen everything.
 * Not intended to be used as core feature, just for some elegant decisions.
 */
export function unsubscribeFromSignals(listener: TSignalListener<any, any>): void {
  SIGNAL_LISTENERS_REGISTRY.delete(listener);
}
