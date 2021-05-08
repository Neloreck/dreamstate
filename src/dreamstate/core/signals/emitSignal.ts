import { IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import {
  IBaseSignal,
  ISignalEvent,
  TAnyContextManagerConstructor,
  TCallable,
  TSignalListener,
  TSignalType
} from "@/dreamstate/types";

/**
 * Callback for signal canceling.
 * Used in signal events for propagation stopping.
 */
function cancelSignal(this: ISignalEvent<TSignalType, unknown>): void {
  this.canceled = true;
}

/**
 * Emit signal and notify all subscribers in an async way.
 * Composes signal event from base data and notifies all listeners in current scope.
 * If event is canceled, stop its propagation to next handlers.
 */
export function emitSignal<D = undefined, T extends TSignalType = TSignalType>(
  base: IBaseSignal<T, D>,
  emitter: TAnyContextManagerConstructor | null = null,
  REGISTRY: IRegistry
): Promise<void> {
  if (!base || base.type === undefined) {
    throw new TypeError("Signal must be an object with declared type.");
  }

  const signalListenersCount: number = REGISTRY.SIGNAL_LISTENERS_REGISTRY.size;
  const signalEvent: ISignalEvent<T, D> = {
    type: base.type,
    data: base.data as D,
    emitter,
    timestamp: Date.now(),
    cancel: cancelSignal
  };

  /**
   * Async processing of subscribed metadata to prevent exception blocking when one handler error stops propagation.
   */
  return new Promise<void>(function(resolve: TCallable): void {
    let processedHandlers: number = 0;

    /**
     * Add signal event processing to the queue.
     */
    REGISTRY.SIGNAL_LISTENERS_REGISTRY.forEach(function(it: TSignalListener<T, D>) {
      setTimeout(function(): void {
        try {
          processedHandlers ++;

          if (!signalEvent.canceled) {
            it(signalEvent);
          }
        } finally {
          if (processedHandlers === signalListenersCount) {
            resolve();
          }
        }
      });
    });
  });
}
