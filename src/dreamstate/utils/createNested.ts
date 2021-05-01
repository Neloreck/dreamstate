import { NestedStore } from "@/dreamstate/core/storing/NestedStore";
import { TAnyObject, TNested } from "@/dreamstate/types";

/**
 * Util for nested.
 */
function asMerged<T extends TAnyObject>(this: TNested<T>, state: Partial<T> = {}): TNested<T> {
  return Object.assign(new NestedStore(), this, state);
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
