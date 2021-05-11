import { TAnyObject, TNested } from "@/dreamstate/types";

/**
 * Class for nested stores extension and proper shallow checking.
 * Used by context diff checker on updates by ContextManager class.
 */
export class NestedStore<T extends TAnyObject = TAnyObject> {

  /**
   * Util for nested stores immutable merging.
   */
  public asMerged(
    state: Partial<T> = {}
  ): TNested<T> {
    return Object.assign(new NestedStore<T>(), this as T, state);
  }

}
