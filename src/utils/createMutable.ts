import { TMutable } from "../types";
import { NestedStore } from "./NestedStore";

import { debug } from "../../build/macroses/debug.macro";

/**
 * Util for mutable.
 */
function asMerged<T extends object>(this: TMutable<T>, state: Partial<T>): T {
  return Object.assign(new NestedStore(), this as TMutable<T>, state);
}

/**
 * Create mutable sub-state.
 */
export function createMutable<T extends object>(initialValue: T): TMutable<T> {
  debug.info("Created mutable entity from:", initialValue);
  if (initialValue === null || typeof initialValue !== "object") {
    throw new TypeError("Mutable values can be created for non-null object parameter only.");
  }

  return Object.assign(new NestedStore(), initialValue, { asMerged: asMerged as any });
}
