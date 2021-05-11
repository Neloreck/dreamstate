import { shallowEqualObjects } from "shallow-equal";

import { log } from "@/macroses/log.macro";

import { ActionsStore } from "@/dreamstate/core/storing/ActionsStore";
import { ComputedValue } from "@/dreamstate/core/storing/ComputedValue";
import { NestedStore } from "@/dreamstate/core/storing/NestedStore";
import { TAnyObject } from "@/dreamstate/types";

/**
 * Compare context manager state diff with shallow check + nested objects check.
 * Respect all meta-fields like NestedStore/ComputedValue/ActionsStore etc.
 *
 * @param previousContext - previous context to match.
 * @param nextContext - next context to match.
 *
 * @return {boolean} result of context objects comparison, whether observers should update or not.
 */
export function shouldObserversUpdate<
  T extends TAnyObject
>(
  previousContext: T,
  nextContext: T
): boolean {
  // todo: Warn computed/nested switch between states when previous and next types are different?
  // todo: Generate context map on creation and work with it.
  // todo: Check context key count on every check?

  if (!nextContext || typeof nextContext !== "object") {
    log.warn("Next context value is null, but ContextManager context field is not nullable. Is it expected?");
    throw new TypeError(`Context should be non-nullable object, supplied '${typeof nextContext}' type instead.`);
  }

  if (!previousContext) {
    return true;
  }

  return (
    Object.keys(nextContext).some(function(key: string): boolean {
      /**
       * Ignore computed values.
       * Ignore action values.
       * Since nested computed stores are not representing data itself, we should not verify anything there.
       */
      if (
        nextContext[key] instanceof ComputedValue ||
        nextContext[key] instanceof ActionsStore
      ) {
        return false;
      }

      /**
       * Shallow check for mutable objects created by library.
       * Optimization for sub-states to prevent pollution of context and improve performance.
       * We cannot guess about each object because it is (1) not obvious, (2) can be unwanted and (3) will not work for
       * some objects like native MediaStream/MediaStreamTrack.
       */
      return nextContext[key] instanceof NestedStore
        ? !shallowEqualObjects(nextContext[key], previousContext[key])
        : nextContext[key] !== previousContext[key];
    })
  );
}
