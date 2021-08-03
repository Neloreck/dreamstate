import { ComputedValue } from "@/dreamstate/core/storing/ComputedValue";
import { TComputed, TAnyObject } from "@/dreamstate/types";

/**
 * Process computed values and replace placeholders with selectors.
 * Mutates context param and updates computed values withing object reference.
 */
export function processComputed<T extends TAnyObject>(context: T): T {
  for (const key in context) {
    const it: TComputed<any> | unknown = context[key];

    if (it instanceof ComputedValue) {
      it.process(context);
    }
  }

  return context;
}
