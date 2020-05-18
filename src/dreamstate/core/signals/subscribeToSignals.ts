import { SIGNAL_LISTENERS_REGISTRY } from "@/dreamstate/core/internals";
import { TSignalListener } from "@/dreamstate/types";

/**
 * Subscribe to all signals and listen everything.
 * Should be filtered by users like redux does.
 * Not intended to be used as core feature, just for some elegant decisions.
 */
export function subscribeToSignals(listener: TSignalListener<any, any>): void {
  SIGNAL_LISTENERS_REGISTRY.add(listener);
}
