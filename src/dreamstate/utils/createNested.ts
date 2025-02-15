import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { NestedStore } from "@/dreamstate/core/storing/NestedStore";
import { EDreamstateErrorCode, TAnyObject, TNested } from "@/dreamstate/types";
import { isObject } from "@/dreamstate/utils/typechecking";

/**
 * Creates a nested sub-state for deeper shallow checking, useful when the context contains nested objects
 * that need to be checked separately during updates.
 *
 * As an example:
 * - `{ first: 'first', second: { one: 1, two: 2 } }` - `first` and `second` will be checked,
 *   while `one` and `two` will be ignored.
 * - `{ first: 'first', second: createNested({ one: 1, two: 2 }) }` - `first`, `one`, and `two`
 *   will be checked during updates.
 *
 * @template T The type of the nested object.
 * @param {T} initialValue The initial value of the nested store object.
 * @returns {TNested<T>} An instance of a nested store containing the initial state, marked for deeper shallow checking.
 */
export function createNested<T extends TAnyObject>(initialValue: T): TNested<T> {
  if (isObject(initialValue)) {
    return Object.assign(new NestedStore<T>(), initialValue);
  } else {
    throw new DreamstateError(
      EDreamstateErrorCode.INCORRECT_PARAMETER,
      `Nested stores should be initialized with an object, got '${typeof initialValue}' instead.`
    );
  }
}
