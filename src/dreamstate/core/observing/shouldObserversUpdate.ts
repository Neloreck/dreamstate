import { shallowEqualObjects } from "shallow-equal";

import { dev } from "@/macroses/dev.macro";

import { ActionsStore } from "@/dreamstate/core/observing/ActionsStore";
import { ComputedValue } from "@/dreamstate/core/observing/ComputedValue";
import { NestedStore } from "@/dreamstate/core/observing/NestedStore";
import { IStringIndexed, TAnyObject } from "@/dreamstate/types";

// todo: Warn computed/nested switch between states when previous and next types are different?

/**
 * Compare context manager state diff with shallow check + nested objects check.
 */
export function shouldObserversUpdate<T extends TAnyObject>(
  previousContext: IStringIndexed<any>,
  nextContext: IStringIndexed<any>
): boolean {
  if (IS_DEV) {
    if (!nextContext) {
      dev.warn("Next context value is null, but ContextManager context field is not nullable. Is it expected?");
    }
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
