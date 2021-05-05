import { SIGNAL_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import {
  ISignalEvent,
  TAnyContextManagerConstructor,
  TSignalType
} from "@/dreamstate/types";

/**
 * Listen signal and call related metadata listeners of this manager.
 */
export function onMetadataSignalListenerCalled<T extends TSignalType = TSignalType, D = undefined>(
  this: InstanceType<TAnyContextManagerConstructor>,
  signal: ISignalEvent<T, D>
): void {
  for (const [ method, subscribed ] of this.constructor[SIGNAL_METADATA_SYMBOL]) {
    if (Array.isArray(subscribed) ? subscribed.includes(signal.type) : signal.type === subscribed) {
      (this as any)[method](signal);
    }
  }
}
