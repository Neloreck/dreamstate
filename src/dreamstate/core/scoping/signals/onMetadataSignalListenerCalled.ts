import { SIGNAL_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { ISignalEvent } from "@/dreamstate/types";

/**
 * Listen signal and call related metadata listeners of bound manager.
 * Used as class instance bound filterer of signals.
 */
export function onMetadataSignalListenerCalled<D = undefined>(
  this: ContextManager<any>,
  signal: ISignalEvent<D>
): void {
  /**
   * For each metadata entry do a check/call for signal handler.
   */
  for (const [ method, subscribed ] of this[SIGNAL_METADATA_SYMBOL]) {
    if (Array.isArray(subscribed) ? subscribed.includes(signal.type) : signal.type === subscribed) {
      (this as any)[method](signal);
    }
  }
}
