import { NestedStore } from "@/dreamstate/core/storing/NestedStore";
import { TAnyObject, TNested } from "@/dreamstate/types";
import { isObject } from "@/dreamstate/utils/typechecking";

/**
 * Create nested sub-state for deeper shallow checking.
 * Useful when your context has some nested objects that should be checked separately.
 *
 * As an example:
 * { first: 'first', second: { one: 1, two: 2 } } - first, second will be checked, one and will be ignored in this case
 * { first: 'first', second: createNested({ one: 1, two: 2 }) } - first, one and two will be checked between updates
 *
 * @param {Object} initialValue - initial value of nested store object.
 * @returns {NestedStore} instance of nested store containing initial state and marked for deeper shallow checking.
 */
export function createNested<T extends TAnyObject>(initialValue: T): TNested<T> {
  if (isObject(initialValue)) {
    return Object.assign(new NestedStore<T>(), initialValue);
  } else {
    throw new TypeError(`Nested stores should be initialized with actions object, got ${typeof initialValue} instead.`);
  }
}
