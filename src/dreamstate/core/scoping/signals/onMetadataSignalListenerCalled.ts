import { SIGNAL_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import {
  ISignalEvent,
  TAnyContextManagerConstructor,
  TSignalType
} from "@/dreamstate/types";

/**
 * Listen signal and call related metadata listeners of bound manager.
 * Used as class instance bound filterer of signals.
 */
export function onMetadataSignalListenerCalled<
  T extends TSignalType = TSignalType,
  D = undefined
>(
  this: ContextManager<any>,
  signal: ISignalEvent<T, D>
): void {
  /**
   * Only if current class has signal metadata check signal handlers.
   */
  if ((this.constructor as TAnyContextManagerConstructor)[SIGNAL_METADATA_SYMBOL]) {
    for (const [ method, subscribed ] of (this.constructor as TAnyContextManagerConstructor)[SIGNAL_METADATA_SYMBOL]) {
      if (Array.isArray(subscribed) ? subscribed.includes(signal.type) : signal.type === subscribed) {
        (this as any)[method](signal);
      }
    }
  }
}
