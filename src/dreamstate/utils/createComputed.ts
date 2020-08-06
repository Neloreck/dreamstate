import { ComputedValue } from "@/dreamstate/core/observing/ComputedValue";
import { TComputed } from "@/dreamstate/types";

/**
 * Create computed value that will be populated after each update.
 */
export function createComputed<T extends object, C extends object>(
  selector: (context: C) => T,
  memo?: (context: C) => Array<any>
): TComputed<T, C> {
  // @ts-ignore not-initialized-computed.
  return Object.assign(
    new ComputedValue(),
    { __selector__: selector, __memo__: memo }
  );
}
