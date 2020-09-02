import { SIGNAL_LISTENERS_REGISTRY } from "@/dreamstate/core/internals";
import { cancelSignal } from "@/dreamstate/core/signals/cancelSignal";
import { ISignal, ISignalEvent, TDreamstateService, TSignalListener, TSignalType } from "@/dreamstate/types";

/**
 * Emit signal and notify all subscribers in async query.
 * If event is canceled, stop its propagation to next handlers.
 */
export function emitSignal<D = undefined, T extends TSignalType = TSignalType>(
  base: ISignal<D, T>,
  emitter: TDreamstateService | null = null
): void {
  if (!base || base.type === undefined) {
    throw new TypeError("Signal must be an object with declared type.");
  }

  const signal: ISignalEvent<D, T> = Object.assign(base as { data: D; type: T }, {
    emitter,
    timestamp: Date.now(),
    cancel: cancelSignal
  });

  // Async processing of subscribed metadata.
  SIGNAL_LISTENERS_REGISTRY.forEach(function(it: TSignalListener<D, T>) {
    setTimeout(function() {
      if (!signal.canceled) {
        it(signal);
      }
    });
  });
}
