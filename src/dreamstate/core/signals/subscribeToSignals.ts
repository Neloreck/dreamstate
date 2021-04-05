import { SIGNAL_LISTENERS_REGISTRY } from "@/dreamstate/core/internals";
import { TSignalListener, TSignalType } from "@/dreamstate/types";

/**
 * Subscribe to all signals and listen everything.
 * Should be filtered by users like redux does.
 * Not intended to be used as core feature, just for some elegant decisions.
 *
 * Returns function that unsubscribe current handler.
 */
export function subscribeToSignals(
  listener: TSignalListener<TSignalType, any>
): () => void {
  if (typeof listener !== "function") {
    throw new Error(`Signal listener must be function, '${typeof listener}' provided.`);
  }

  SIGNAL_LISTENERS_REGISTRY.add(listener);

  return function() {
    SIGNAL_LISTENERS_REGISTRY.delete(listener);
  };
}
