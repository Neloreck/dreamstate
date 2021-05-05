import { IRegistry } from "@/dreamstate/core/registry/createRegistry";
import {
  IBaseSignal,
  ISignalEvent,
  TAnyContextManagerConstructor,
  TCallable,
  TSignalListener,
  TSignalType
} from "@/dreamstate/types";

function cancelSignal(this: ISignalEvent<TSignalType, unknown>): void {
  this.canceled = true;
}

/**
 * Emit signal and notify all subscribers in async query.
 * If event is canceled, stop its propagation to next handlers.
 */
export function emitSignal<D = undefined, T extends TSignalType = TSignalType>(
  base: IBaseSignal<T, D>,
  emitter: TAnyContextManagerConstructor | null = null,
  { SIGNAL_LISTENERS_REGISTRY }: IRegistry
): Promise<void> {
  if (!base || base.type === undefined) {
    throw new TypeError("Signal must be an object with declared type.");
  }

  const signal: ISignalEvent<T, D> = Object.assign(base as { data: D; type: T }, {
    emitter,
    timestamp: Date.now(),
    cancel: cancelSignal
  });

  // Async processing of subscribed metadata to prevent exception blocking.
  return new Promise<void>(function(resolve: TCallable): void {
    const handlersToProcessCount: number = SIGNAL_LISTENERS_REGISTRY.size;
    let processedHandlers: number = 0;

    SIGNAL_LISTENERS_REGISTRY.forEach(function(it: TSignalListener<T, D>) {
      setTimeout(function() {
        try {
          processedHandlers ++;

          if (!signal.canceled) {
            it(signal);
          }
        } finally {
          if (processedHandlers === handlersToProcessCount) {
            resolve();
          }
        }
      });
    });
  });
}
