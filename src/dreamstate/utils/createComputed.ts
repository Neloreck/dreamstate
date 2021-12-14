import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { ComputedValue } from "@/dreamstate/core/storing/ComputedValue";
import { EDreamstateErrorCode, TAnyObject, TComputed } from "@/dreamstate/types";
import { isFunction, isUndefined } from "@/dreamstate/utils/typechecking";

/**
 * Create computed value that will be re-calculated after each context update.
 *
 * @param {Function} selector - generic selector that will return computed values on update.
 * @param {Function} memo - memo checker that will return array of dependencies
 *   indicating whether computed should be updated.
 * @returns {TComputed<T, C>} computed value object.
 */
export function createComputed<T extends TAnyObject, C extends TAnyObject>(
  selector: (context: C) => T,
  memo?: (context: C) => Array<any>
): TComputed<T, C> {
  if (isFunction(selector) && (isUndefined(memo) || isFunction(memo))) {
    // Cast computed to T & TComputed since it works like state object later.
    return new ComputedValue<T, C>(selector, memo) as any as TComputed<T, C>;
  } else {
    throw new DreamstateError(
      EDreamstateErrorCode.INCORRECT_PARAMETER,
      "Computed value should be initialized with functional selector and optional memo function."
    );
  }
}
