import { IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import {
  IBaseSignal,
  ISignalEvent,
  TAnyContextManagerConstructor,
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
): void {
  if (!base || base.type === undefined) {
    throw new TypeError("Signal must be an object with declared type.");
  }

  const signalEvent: ISignalEvent<T, D> = {
    type: base.type,
    data: base.data as D,
    emitter,
    timestamp: Date.now(),
    cancel: cancelSignal
  };

  REGISTRY.SIGNAL_LISTENERS_REGISTRY.forEach(function(it: TSignalListener<T, D>) {
    try {
      if (!signalEvent.canceled) {
        it(signalEvent);
      }
    } catch (error) {
      // nothing to do currently, todo: print stack trace?
    }
  });
}
