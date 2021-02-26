import { NestedStore } from "@/dreamstate/core/observing/NestedStore";
import { TAnyObject, TNested } from "@/dreamstate/types";

/**
 * Util for nested.
 */
function asMerged<T extends TAnyObject>(this: TNested<T>, state: Partial<T>): T {
  return Object.assign(new NestedStore(), this as TNested<T>, state);
}

/**
 * Create nested sub-state.
 */
export function createNested<T extends TAnyObject>(initialValue: T): TNested<T> {
  if (initialValue === null || typeof initialValue !== "object") {
    throw new TypeError("Nested values can be created for non-null object parameter only.");
  }

  return Object.assign(new NestedStore(), initialValue, { asMerged: asMerged as any });
}