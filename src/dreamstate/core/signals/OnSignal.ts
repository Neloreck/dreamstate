import { SIGNAL_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { createMethodDecorator } from "@/dreamstate/polyfills/createMethodDecorator";
import {
  TAnyContextManagerConstructor,
  TSignalType
} from "@/dreamstate/types";

/**
 * Class method decorator.
 * Marks decorated method as handler of provided type(s) signals.
 * All signals in current scope with specified type will be handled by callback.
 *
 * @param {(TSignalType|Array.<TSignalType>>)} signalType - signal or array of signals that should be handled.
 */
export function OnSignal(signalType: Array<TSignalType> | TSignalType): MethodDecorator {
  /**
   * todo: Better validation with typechecking?
   */
  if (!signalType) {
    throw new TypeError("Signal type should be provided for OnQuery decorator.");
  }

  /**
   * Support old and new decorators with polyfill.
   */
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
