import { shallowEqualObjects } from "shallow-equal";

import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { ActionsStore } from "@/dreamstate/core/storing/ActionsStore";
import { ComputedValue } from "@/dreamstate/core/storing/ComputedValue";
import { NestedStore } from "@/dreamstate/core/storing/NestedStore";
import { EDreamstateErrorCode, TAnyObject } from "@/dreamstate/types";
import { isObject } from "@/dreamstate/utils/typechecking";

/**
 * Compares two context manager states to determine if there are any changes that would require
 * observers to update. Performs a shallow comparison while respecting specific meta-fields like
 * `NestedStore`, `ComputedValue`, `ActionsStore`, etc. to ensure that nested objects and specialized
 * stores are taken into account during the comparison.
 *
 * The comparison helps decide whether the observers need to react to the changes and re-render accordingly.
 *
 * @template T - The type of the context state.
 * @param {T} previousContext - The previous context to be compared against.
 * @param {T} nextContext - The new context to check for differences.
 * @returns {boolean} - `true` if observers should update (i.e., if there is a difference between
 *   the contexts); `false` otherwise.
 */
export function shouldObserversUpdate<T extends TAnyObject>(previousContext: T, nextContext: T): boolean {
  if (!isObject(nextContext)) {
    throw new DreamstateError(
      EDreamstateErrorCode.INCORRECT_PARAMETER,
      `Context should be non-nullable object, supplied '${typeof nextContext}' type instead.`
    );
  }

  if (!previousContext) {
    return true;
  }

  return Object.keys(nextContext).some(function(key: string): boolean {
    /*
     * Ignore computed values.
     * Ignore action values.
     * Since nested computed stores are not representing data itself, we should not verify anything there.
     */
    if (nextContext[key] instanceof ComputedValue || nextContext[key] instanceof ActionsStore) {
      return false;
    }

    /*
     * Shallow check for mutable objects created by library.
     * Optimization for sub-states to prevent pollution of context and improve performance.
     * We cannot guess about each object because it is (1) not obvious, (2) can be unwanted and (3) will not work for
     * some objects like native MediaStream/MediaStreamTrack.
     */
    return nextContext[key] instanceof NestedStore
      ? !shallowEqualObjects(nextContext[key], previousContext[key])
      : nextContext[key] !== previousContext[key];
  });
}
