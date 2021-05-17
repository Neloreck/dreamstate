import { ComputedValue } from "@/dreamstate/core/storing/ComputedValue";
import { TAnyObject, TComputed } from "@/dreamstate/types";
import { isFunction, isUndefined } from "@/dreamstate/utils/typechecking";

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
  if (isFunction(selector) && (isUndefined(memo) || isFunction(memo))) {
    // Cast computed to T & TComputed since it works like state object later.
    return new ComputedValue<T, C>(selector, memo) as any as TComputed<T, C>;
  } else {
    throw new TypeError("Computed value should be initialized with functional selector and optional memo function.");
  }
}

