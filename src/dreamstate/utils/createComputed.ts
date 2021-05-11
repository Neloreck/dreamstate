import { ComputedValue } from "@/dreamstate/core/storing/ComputedValue";
import { TAnyObject, TComputed } from "@/dreamstate/types";

/**
 * Create computed value that will be populated after each update.
 */
export function createComputed<
  T extends TAnyObject,
  C extends TAnyObject
>(
  selector: (context: C) => T,
  memo?: (context: C) => Array<any>
): TComputed<T, C> {
  // Cast computed to T & TComputed since it works like state object later.
  return new ComputedValue<T, C>(selector, memo) as any as TComputed<T, C>;
}

