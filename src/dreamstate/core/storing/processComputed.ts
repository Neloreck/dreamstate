import { ComputedValue } from "@/dreamstate/core/storing/ComputedValue";
import { TComputed, TAnyObject } from "@/dreamstate/types";

/**
 * Processes computed values within the given context.
 *
 * This function mutates the provided context object, updating its computed values while maintaining
 * the original object reference. It ensures that computed properties are properly initialized
 * and reactive based on the current state.
 *
 * @template T - The type of the context object.
 * @param {T} context - The context object containing computed values to be processed.
 * @returns {T} The same context object with updated computed values.
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
