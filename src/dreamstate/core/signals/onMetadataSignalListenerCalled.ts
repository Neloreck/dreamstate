import { CONTEXT_SIGNAL_METADATA_REGISTRY } from "@/dreamstate/core/internals";
import { ISignalEvent, TConstructorKey, TDreamstateService, TSignalType } from "@/dreamstate/types";

/**
 * Listen signal and call related metadata listeners of this manager.
 */
export function onMetadataSignalListenerCalled<T extends TSignalType = TSignalType, D = undefined>(
  this: InstanceType<TDreamstateService>,
  signal: ISignalEvent<T, D>
): void {
  /**
   * Ignore managers without metadata.
   */
  if (CONTEXT_SIGNAL_METADATA_REGISTRY.has(this.constructor as TDreamstateService)) {
    for (const [ method, subscribed ] of CONTEXT_SIGNAL_METADATA_REGISTRY.get(this.constructor as TConstructorKey)!) {
      if (Array.isArray(subscribed) ? subscribed.includes(signal.type) : signal.type === subscribed) {
        (this as any)[method](signal);
      }
    }
  }
}
