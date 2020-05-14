import { ISignalEvent, TConstructorKey, TDreamstateService, TSignalType } from "@Lib/types";
import { CONTEXT_SIGNAL_METADATA_REGISTRY } from "@Lib/internals";

import { debug } from "@Macro/debug.macro";

/**
 * Listen signal and call related metadata listeners of this manager.
 */
export function onMetadataSignalListenerCalled<D = undefined, T extends TSignalType = TSignalType>(
  this: InstanceType<TDreamstateService>,
  signal: ISignalEvent<D, T>
): void {
  /**
   * Ignore own signals and managers without metadata.
   */
  if (
    signal.emitter !== this.constructor &&
    CONTEXT_SIGNAL_METADATA_REGISTRY.has(this.constructor as TDreamstateService)
  ) {
    debug.info("Calling metadata signal api listener:", this.constructor.name);

    for (const [ method, subscribed ] of CONTEXT_SIGNAL_METADATA_REGISTRY.get(this.constructor as TConstructorKey)!) {
      if (Array.isArray(subscribed) ? subscribed.includes(signal.type) : signal.type === subscribed) {
        debug.info("Found signal listener:", signal.type, this.constructor.name, method);
        (this as any)[method](signal);
      }
    }
  }
}
