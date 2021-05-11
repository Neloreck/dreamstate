import { IComputedBase, TAnyObject } from "@/dreamstate/types";

/**
 * Class for nested computed values.
 * Used by context diff checker on updates by ContextManager class.
 */
export class ComputedValue<
  T extends TAnyObject,
  C extends TAnyObject
> implements IComputedBase<T, C> {

  public readonly __selector__: (context: C) => T;

  public readonly __memo__?: (context: C) => Array<any>;

  public __diff__?: Array<any>;

  public constructor(
    selector: (context: C) => T,
    memo?: (context: C) => Array<any>
  ) {
    this.__selector__ = selector;
    this.__memo__ = memo;
  }

  public process(context: C): void {
    // Process memoized computed in a special way, updated default computed every time.
    if (this.__memo__) {
      const diff: Array<any> = this.__memo__(context);

      // Warn if someone provided wrong selector.
      if (IS_DEV) {
        if (!Array.isArray(diff)) {
          console.warn(
            "Expecting diff function from createComputed to return diff-array of dependencies."
          );
        }
      }

      // If diff initialized and we can check memo values.
      if (!this.__diff__ || this.__diff__.some(function(it: any, idx: number) {
        return it !== diff[idx];
      })) {
        this.__diff__ = diff;

        Object.assign(
          this,
          this.__selector__(context)
        );
      }
    } else {
      Object.assign(
        this,
        this.__selector__(context)
      );
    }
  }

}
