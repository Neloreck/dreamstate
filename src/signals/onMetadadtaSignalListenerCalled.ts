import { ISignalEvent, TAnyContextManagerConstructor, TSignalType } from "../types";
import { CONTEXT_SIGNAL_METADATA_REGISTRY, IDENTIFIER_KEY } from "../internals";
import { ContextManager } from "../management";

import { log } from "../../build/macroses/log.macro";

/**
 * Listen signal and call related metadata listeners of this manager.
 */
export function onMetadataSignalListenerCalled<D = undefined, T extends TSignalType = TSignalType>(
  this: ContextManager<any>,
  signal: ISignalEvent<D, T>
): void {
  /**
   * Ignore own signals.
   */
  if (signal.emitter !== this) {
    log.info("Calling metadata signal api listener:", this.constructor.name);

    for (const [ method, subscribed ] of CONTEXT_SIGNAL_METADATA_REGISTRY[
      (this.constructor as TAnyContextManagerConstructor)[IDENTIFIER_KEY]
    ]) {
      if (Array.isArray(subscribed) ? subscribed.includes(signal.type) : signal.type === subscribed) {
        log.info("Found signal listener:", signal.type, this.constructor.name, method);
        (this as any)[method](signal);
      }
    }
  }
}
