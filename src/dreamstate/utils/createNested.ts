import { NestedStore } from "@/dreamstate/core/storing/NestedStore";
import { TAnyObject, TNested } from "@/dreamstate/types";

/**
 * Util for nested stores immutable merging.
 */
function asMerged<T extends TAnyObject>(
  this: TNested<T>,
  state: Partial<T> = {}
): TNested<T> {
  return Object.assign(new NestedStore(), this, state);
}

/**
 * Create nested sub-state for deeper shallow checking.
 * Useful when your context has some nested objects that should be checked separately.
 *
 * As an example:
 * { first: 'first', second: { one: 1, two: 2 } } - first, second will be checked, one and will be ignored in this case
 * { first: 'first', second: createNested({ one: 1, two: 2 }) } - first, one and two will be checked between updates
 */
export function createNested<T extends TAnyObject>(
  initialValue: T
): TNested<T> {
  if (initialValue === null || typeof initialValue !== "object") {
    throw new TypeError("Nested values can be created for non-null object parameter only.");
  }

  return Object.assign(new NestedStore(), initialValue, { asMerged: asMerged as any });
}
