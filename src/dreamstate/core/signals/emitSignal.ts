import { log } from "@/macroses/log.macro";

import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import {
  EDreamstateErrorCode,
  IBaseSignal,
  ISignalEvent,
  TAnyContextManagerConstructor,
  TSignalListener
} from "@/dreamstate/types";
import { isCorrectSignalType } from "@/dreamstate/utils/typechecking";

/**
 * Callback for signal canceling.
 * Used in signal events for propagation stopping.
 */
function cancelSignal<D = undefined>(this: ISignalEvent<D>): ISignalEvent<D> {
  this.canceled = true;

  return this;
}

/**
 * Emit signal and notify all subscribers in an async way.
 * Composes signal event from base data and notifies all listeners in current scope.
 * If event is canceled, stop its propagation to next handlers.
 */
export function emitSignal<D = undefined>(
  base: IBaseSignal<D>,
  emitter: TAnyContextManagerConstructor | null = null,
  REGISTRY: IRegistry
): ISignalEvent<D> {
  if (!base || !isCorrectSignalType(base.type)) {
    throw new DreamstateError(EDreamstateErrorCode.INCORRECT_SIGNAL_TYPE);
  }

  const signalEvent: ISignalEvent<D> = {
    type: base.type,
    data: base.data as D,
    emitter,
    timestamp: Date.now(),
    cancel: cancelSignal
  };

  REGISTRY.SIGNAL_LISTENERS_REGISTRY.forEach(function(it: TSignalListener<D>) {
    try {
      if (!signalEvent.canceled) {
        it(signalEvent);
      }
    } catch (error) {
      log.error(`Failed to proceed emitted signal (${String(base.type)}):`, error);
    }
  });

  return signalEvent;
}
