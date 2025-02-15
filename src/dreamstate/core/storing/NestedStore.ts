import { TAnyObject, TNested } from "@/dreamstate/types";

/**
 * A utility class for extending context manager state with structured state management and shallow comparison.
 *
 * This class is used by the `ContextManager` to efficiently track and compare nested state updates.
 * It helps in optimizing reactivity by ensuring that updates trigger only when relevant changes occur.
 */
export class NestedStore<T extends TAnyObject = TAnyObject> {
  /**
   * Merges the provided partial state with the existing state and returns a shallow copy.
   *
   * @template T - The type of the state.
   * @param {Partial<T>} state The next state partial to merge with the existing state and commit update.
   * @returns {TNested<T>} A merged shallow copy based on the partial state parameter.
   */
  public asMerged(state: Partial<T> = {} as T): TNested<T> {
    return Object.assign(new NestedStore<T>(), this as unknown as T, state);
  }
}
