import { ISignal, ISignalEvent, TDreamstateService, TSignalListener, TSignalType } from "../types";
import { SIGNAL_LISTENERS_REGISTRY } from "../internals";
import { cancelSignal } from "./cancelSignal";

import { log } from "../../build/macroses/log.macro";

/**
 * Emit signal and notify all subscribers in async query.
 * If event is canceled, stop its propagation to next handlers.
 */
export function emitSignal<D = undefined, T extends TSignalType = TSignalType>(
  base: ISignal<D, T>,
  emitter: TDreamstateService | null = null
): void {
  // Validate query type.
  if (!base || !base.type) {
    throw new TypeError("Signal must be an object with declared type.");
  }

  const signal: ISignalEvent<D, T> = Object.assign(base as { data: D; type: T }, {
    emitter,
    timestamp: Date.now(),
    cancel: cancelSignal
  });

  log.info("Signal API emit signal:", base, emitter ? emitter.constructor.name : null);

  // Async processing of subscribed metadata.
  SIGNAL_LISTENERS_REGISTRY.forEach(function (it: TSignalListener<D, T>) {
    setTimeout(function () {
      if (!signal.canceled) {
        it(signal);
      } else {
        log.info("Signal API ignore canceled signal:", signal);
      }
    });
  });
}
