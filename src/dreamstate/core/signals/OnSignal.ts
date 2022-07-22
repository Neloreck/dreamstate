import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { SIGNAL_METADATA_REGISTRY } from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { EDreamstateErrorCode, TAnyContextManagerConstructor, TSignalType } from "@/dreamstate/types";
import { createMethodDecorator } from "@/dreamstate/utils/polyfills/createMethodDecorator";
import { isCorrectSignalType } from "@/dreamstate/utils/typechecking";

/**
 * Class method decorator.
 * Marks decorated method as handler of provided type(s) signals.
 * All signals in current scope with specified type will be handled by callback.
 *
 * Correct query types: string, number, symbol.
 *
 * @param {(TSignalType|Array.<TSignalType>>)} signalType - signal or array of signals that should be handled.
 */
export function OnSignal(signalType: Array<TSignalType> | TSignalType): MethodDecorator {
  /**
   * If array:
   *  - Check not empty
   *  - Validate all elements
   * If single type:
   *  - Check the only value
   */
  if (
    Array.isArray(signalType)
      ? signalType.length === 0 ||
        signalType.some(function(it) {
          return !isCorrectSignalType(it);
        })
      : !isCorrectSignalType(signalType)
  ) {
    throw new DreamstateError(
      EDreamstateErrorCode.INCORRECT_PARAMETER,
      `Unexpected signal type provided, expected symbol, string, number or array of it. Got: ${typeof signalType}.`
    );
  }

  /**
   * Support old and new decorators with polyfill.
   */
  return createMethodDecorator<TAnyContextManagerConstructor>(function(
    method: string | symbol,
    ManagerClass: TAnyContextManagerConstructor
  ): void {
    if (!(ManagerClass.prototype instanceof ContextManager)) {
      throw new DreamstateError(
        EDreamstateErrorCode.INCORRECT_PARAMETER,
        "Only ContextManager extending classes methods can be decorated as handlers."
      );
    }

    if (SIGNAL_METADATA_REGISTRY.has(ManagerClass)) {
      SIGNAL_METADATA_REGISTRY.get(ManagerClass)!.push([ method, signalType ]);
    } else {
      SIGNAL_METADATA_REGISTRY.set(ManagerClass, [ [ method, signalType ] ]);
    }
  });
}
