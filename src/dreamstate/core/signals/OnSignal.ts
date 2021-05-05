import { SIGNAL_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { createMethodDecorator } from "@/dreamstate/polyfills/createMethodDecorator";
import {
  TAnyContextManagerConstructor,
  TSignalType
} from "@/dreamstate/types";

/**
 * Write signal filter and bound method to class metadata.
 */
export function OnSignal(signalType: Array<TSignalType> | TSignalType): MethodDecorator {
  if (!signalType) {
    throw new TypeError("Signal type should be provided for OnQuery decorator.");
  }

  return createMethodDecorator<TAnyContextManagerConstructor>(function(
    method: string | symbol,
    Service: TAnyContextManagerConstructor
  ): void {
    if (!(Service.prototype instanceof ContextManager)) {
      throw new TypeError("Only ContextManager extending classes methods can be decorated as handlers.");
    }

    if (!Service[SIGNAL_METADATA_SYMBOL]) {
      Service[SIGNAL_METADATA_SYMBOL] = [];
    }

    Service[SIGNAL_METADATA_SYMBOL].push([ method, signalType ]);
  });
}
