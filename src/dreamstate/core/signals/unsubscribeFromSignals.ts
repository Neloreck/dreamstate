import { SIGNAL_LISTENERS_REGISTRY } from "@/dreamstate/core/internals";
import { TSignalListener, TSignalType } from "@/dreamstate/types";

/**
 * Unsubscribe from all signals for specified listener.
 * Not intended to be used as core feature, just for some elegant decisions.
 */
export function unsubscribeFromSignals<
  T extends TSignalType,
  D = undefined
>(
  listener: TSignalListener<T, D>
): void {
  SIGNAL_LISTENERS_REGISTRY.delete(listener);
}
