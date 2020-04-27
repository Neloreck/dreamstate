import { shallowEqualObjects } from "shallow-equal";

import { NestedStore } from "../utils";
import { IStringIndexed } from "../types";

/**
 * Compare context manager state diff with shallow check + nested objects check.
 */
export function shouldObserversUpdate<T extends object>(
  previousContext: IStringIndexed<any>,
  nextContext: IStringIndexed<any>
): boolean {
  // If previous context is registered and current supplied.
  return (
    !previousContext ||
    Object.keys(nextContext).some(function (key: string): boolean {
      const nextValue: any = nextContext[key];

      /**
       * Shallow check for mutable objects created by library.
       * Optimization for sub-states to prevent pollution of context and improve performance.
       * We cannot guess about each object because it is (1) not obvious, (2) can be unwanted and (3) will not work for
       * some objects like native MediaStream/MediaStreamTrack.
       *
       * todo: Check if one object is mutable, but next is not and print warnings.
       */
      return nextValue !== null && typeof nextValue === "object" && nextValue instanceof NestedStore
        ? !shallowEqualObjects(nextValue, previousContext[key])
        : nextValue !== previousContext[key];
    })
  );
}
