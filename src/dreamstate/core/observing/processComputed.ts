import { ComputedValue } from "@/dreamstate/core/observing/ComputedValue";
import { IComputed } from "@/dreamstate/types";

/**
 * Process computed values and replace placeholders with selectors.
 */
export function processComputed<T extends object>(
  context: T
): void {
  for (const key in context) {
    // Cast as possible computed value because it is the only one that we expect to process here.
    const it: IComputed<any, any> = context[key] as any;

    if (it instanceof ComputedValue) {
      // Warn if someone deleted __selector__ prop.
      if (IS_DEV) {
        if (!it.__selector__) {
          console.warn(
            "Seems like computed value was manually changed or updated - '__selector__' is missing before update."
          );
        }
      }

      // Process memoized computed in a special way, updated default computed every time.
      if (it.__memo__) {
        const diff: Array<any> = it.__memo__(context);

        // Warn if someone provided wrong selector.
        if (IS_DEV) {
          if (!Array.isArray(diff)) {
            console.warn(
              "Expecting diff function from createComputed to return diff-array of dependencies."
            );
          }
        }

        // If diff initialized and we can check memo values.
        if (!it.__diff__ || it.__diff__.some(function(it: any, idx: number) {
          return it !== diff[idx];
        })) {
          context[key] = Object.assign(
            new ComputedValue(),
            it.__selector__(context),
            { __selector__: it.__selector__, __memo__: it.__memo__, __diff__: diff }
          );
        }
        // Else nothing to do there, leave value as it is.
      } else {
        context[key] = Object.assign(
          new ComputedValue(),
          it.__selector__(context),
          { __selector__: it.__selector__ }
        );
      }
    }
  }
}
