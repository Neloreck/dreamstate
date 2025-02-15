import { SIGNAL_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/management/ContextManager";
import { ISignalEvent, TAnyValue } from "@/dreamstate/types";

/**
 * Processes a metadata signal and dispatches it to the corresponding metadata listeners
 * of the bound manager.
 *
 * This function is intended to be used as a method bound to a ContextManager instance. It
 * filters incoming signal events and calls metadata listeners that are associated with the
 * manager instance.
 *
 * @template D - The type of the data contained in the signal event.
 * @param {ISignalEvent<D>} signal - The signal event containing the signal type and optional data.
 * @returns {void}
 */
export function onMetadataSignalListenerCalled<D = undefined>(
  this: ContextManager<TAnyValue>,
  signal: ISignalEvent<D>
): void {
  /*
   * For each metadata entry do a check/call for signal handler.
   */
  for (const [method, subscribed] of this[SIGNAL_METADATA_SYMBOL]) {
    if (Array.isArray(subscribed) ? subscribed.includes(signal.type) : signal.type === subscribed) {
      (this as TAnyValue)[method](signal);
    }
  }
}
