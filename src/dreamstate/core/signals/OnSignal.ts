import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { SIGNAL_METADATA_REGISTRY } from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/management/ContextManager";
import { EDreamstateErrorCode, TAnyContextManagerConstructor, TSignalType } from "@/dreamstate/types";
import { createMethodDecorator } from "@/dreamstate/utils/polyfills/createMethodDecorator";
import { isCorrectSignalType } from "@/dreamstate/utils/typechecking";

/**
 * Class method decorator factory that marks the decorated method as a handler for specified signal types.
 *
 * This decorator ensures that the decorated method is invoked when a signal of the specified type(s)
 * is emitted within the current scope. It supports handling a single signal type or an array of signal types.
 *
 * Supported signal types include: `string`, `number`, and `symbol`.
 *
 * @param {(TSignalType | Array<TSignalType>)} signalType - The signal type or an array of signal types
 *   that the decorated method will handle.
 * @returns {MethodDecorator} A method decorator that attaches the handler functionality to the method.
 */
export function OnSignal(signalType: Array<TSignalType> | TSignalType): MethodDecorator {
  /*
   * If Array:
   *  - Check not empty
   *  - Validate all elements
   * If single type:
   *  - Check the only value
   */
  if (
    Array.isArray(signalType)
      ? signalType.length === 0 ||
        signalType.some(function(it: TSignalType): it is never {
          return !isCorrectSignalType(it);
        })
      : !isCorrectSignalType(signalType)
  ) {
    throw new DreamstateError(
      EDreamstateErrorCode.INCORRECT_PARAMETER,
      `Unexpected signal type provided, expected symbol, string, number or array of it. Got: ${typeof signalType}.`
    );
  }

  /*
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
      SIGNAL_METADATA_REGISTRY.get(ManagerClass)!.push([method, signalType]);
    } else {
      SIGNAL_METADATA_REGISTRY.set(ManagerClass, [[method, signalType]]);
    }
  });
}
