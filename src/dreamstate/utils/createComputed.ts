import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { ComputedValue } from "@/dreamstate/core/storing/ComputedValue";
import { EDreamstateErrorCode, TAnyObject, TAnyValue, TComputed } from "@/dreamstate/types";
import { isFunction, isUndefined } from "@/dreamstate/utils/typechecking";

/**
 * Creates a computed value that will be re-calculated after each context update.
 * The computed value is recalculated only when its dependencies, as determined by the memo function,
 * are updated.
 *
 * @template T The type of the computed value.
 * @template C The type of the context the computed value depends on.
 * @param {Function} selector A generic selector function that returns computed values on update.
 * @param {Function} memo An optional memo checker function that returns an array of dependencies,
 *   indicating whether the computed value should be updated.
 * @returns {TComputed<T, C>} A computed value object that will be updated based on context changes.
 */
export function createComputed<T extends TAnyObject, C extends TAnyObject>(
  selector: (context: C) => T,
  memo?: (context: C) => Array<TAnyValue>
): TComputed<T, C> {
  if (isFunction(selector) && (isUndefined(memo) || isFunction(memo))) {
    // Cast computed to T & TComputed since it works like state object later.
    return new ComputedValue<T, C>(selector, memo) as unknown as TComputed<T, C>;
  } else {
    throw new DreamstateError(
      EDreamstateErrorCode.INCORRECT_PARAMETER,
      "Computed value should be initialized with functional selector and optional memo function."
    );
  }
}
