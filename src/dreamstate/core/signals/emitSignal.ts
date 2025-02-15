import { log } from "@/macroses/log.macro";

import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import {
  EDreamstateErrorCode,
  IBaseSignal,
  ISignalEvent,
  TAnyContextManagerConstructor,
  TSignalListener,
} from "@/dreamstate/types";
import { isCorrectSignalType } from "@/dreamstate/utils/typechecking";

/**
 * Cancels the signal event, preventing further propagation to subsequent listeners.
 *
 * This method is used within signal events to stop their execution, ensuring that
 * no additional subscribers receive the event after cancellation.
 *
 * @template D - The type of the signal event data, defaults to `undefined`.
 * @returns {ISignalEvent<D>} The canceled signal event instance.
 */
function cancelSignal<D = undefined>(this: ISignalEvent<D>): ISignalEvent<D> {
  this.canceled = true;

  return this;
}

/**
 * Emits a signal and notifies all subscribed listeners.
 *
 * This function constructs a signal event from the provided base data and dispatches it
 * to all registered listeners within the current scope. If any listener cancels the event,
 * propagation to subsequent handlers is stopped.
 *
 * @template D - The type of the signal event data, defaults to `undefined`.
 * @param {IBaseSignal<D>} base - The base signal data used to create the event.
 * @param {TAnyContextManagerConstructor | null} [emitter] - The optional emitter of the signal,
 *   typically a context manager class.
 * @param {IRegistry} REGISTRY - The registry containing all signal event listeners.
 * @returns {ISignalEvent<D>} The dispatched signal event instance.
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
    cancel: cancelSignal,
  };

  // todo: Use for-in and break loop on cancel.
  REGISTRY.SIGNAL_LISTENERS_REGISTRY.forEach(function(it: TSignalListener<D>): void {
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
