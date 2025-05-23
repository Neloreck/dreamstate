import { IComputedBase, TAnyObject, TAnyValue } from "@/dreamstate/types";

/**
 * A utility class for managing nested computed values.
 *
 * This class is used by the `ContextManager` to track and compare computed values during context updates.
 * It helps optimize state management by recalculating values only when dependencies change.
 */
export class ComputedValue<T extends TAnyObject, C extends TAnyObject> implements IComputedBase<T, C> {
  public readonly __selector__: (context: C) => T;
  public readonly __memo__?: (context: C) => Array<TAnyValue>;

  public __diff__?: Array<TAnyValue>;

  public constructor(selector: (context: C) => T, memo?: (context: C) => Array<TAnyValue>) {
    this.__selector__ = selector;
    this.__memo__ = memo;
  }

  public process(context: C): void {
    // Process memoized computed in a special way, updated default computed every time.
    if (this.__memo__) {
      const diff: Array<TAnyValue> = this.__memo__(context);

      // Warn if someone provided wrong selector.
      if (IS_DEV) {
        if (!Array.isArray(diff)) {
          console.warn("Expecting diff function from createComputed to return diff-array of dependencies.");
        }
      }

      // If diff initialized and we can check memo values.
      if (
        !this.__diff__ ||
        this.__diff__.some(function(it: TAnyValue, idx: number): boolean {
          return it !== diff[idx];
        })
      ) {
        this.__diff__ = diff;

        Object.assign(this, this.__selector__(context));
      }
    } else {
      Object.assign(this, this.__selector__(context));
    }
  }
}
