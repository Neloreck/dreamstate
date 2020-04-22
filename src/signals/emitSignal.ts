import { ISignal, ISignalEvent, TSignalListener, TSignalType } from "../types";
import { SIGNAL_LISTENERS_REGISTRY } from "../internals";
import { ContextManager } from "../management";

import { log } from "../../build/macroses/log.macro";

/**
 * Emit signal and notify all subscribers in async query.
 * If event is cancelled, stop its propagation to next handlers.
 */
export function emitSignal<D = undefined, T extends TSignalType = TSignalType>(
  base: ISignal<D, T>,
  emitter: ContextManager<any> | null = null
): void {
  const signal: ISignalEvent<D, T> = Object.assign(
    base as { data: D; type: T },
    {
      emitter,
      cancel: function (): void {
        (this as ISignalEvent<D, T>).cancelled = true;
      }
    });

  log.info("Signal API emit signal:", base, emitter ? emitter.constructor.name : null);

  // Async processing of subscribed metadata.
  SIGNAL_LISTENERS_REGISTRY.forEach(function (it: TSignalListener<D, T>) {
    setTimeout(function () {
      // todo: Check if cancel will work?
      if (!signal.cancelled) {
        it(signal);
      } else {
        log.info("Signal API ignore cancelled signal:", signal);
      }
    });
  });
}
