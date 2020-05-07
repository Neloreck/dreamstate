import { ISignalEvent, TConstructorKey, TDreamstateWorker, TSignalType } from "../types";
import { CONTEXT_SIGNAL_METADATA_REGISTRY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Listen signal and call related metadata listeners of this manager.
 */
export function onMetadataSignalListenerCalled<D = undefined, T extends TSignalType = TSignalType>(
  this: InstanceType<TDreamstateWorker>,
  signal: ISignalEvent<D, T>
): void {
  /**
   * Ignore own signals and managers without metadata.
   */
  if (
    signal.emitter !== this.constructor &&
    CONTEXT_SIGNAL_METADATA_REGISTRY.has(this.constructor as TDreamstateWorker)
  ) {
    log.info("Calling metadata signal api listener:", this.constructor.name);

    for (const [ method, subscribed ] of CONTEXT_SIGNAL_METADATA_REGISTRY.get(this.constructor as TConstructorKey)!) {
      if (Array.isArray(subscribed) ? subscribed.includes(signal.type) : signal.type === subscribed) {
        log.info("Found signal listener:", signal.type, this.constructor.name, method);
        (this as any)[method](signal);
      }
    }
  }
}
