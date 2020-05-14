
import { IStringIndexed } from "@Lib/core/types";
import { NestedStore } from "@Lib/core/utils/NestedStore";

import { dev } from "@Macro/dev.macro";
import { shallowEqualObjects } from "shallow-equal";

/**
 * Compare context manager state diff with shallow check + nested objects check.
 */
export function shouldObserversUpdate<T extends object>(
  previousContext: IStringIndexed<any>,
  nextContext: IStringIndexed<any>
): boolean {
  if (IS_DEV) {
    if (!nextContext) {
      dev.warn("Next context value is null, but ContextManager context field is not nullable. Is it expected?");
    }
  }

  return (
    !previousContext ||
    Object.keys(nextContext).some(function(key: string): boolean {
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
