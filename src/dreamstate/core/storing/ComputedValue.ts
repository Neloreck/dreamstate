import { IComputedBase, TAnyObject } from "@/dreamstate/types";

/**
 * Class for nested computed values.
 * Used by context diff checker on updates by ContextManager class.
 */
export class ComputedValue<
  T extends TAnyObject = TAnyObject,
  C extends TAnyObject = TAnyObject
> implements IComputedBase<T, C> {

  public readonly __selector__!: (context: C) => T;

  public readonly __memo__?: (context: C) => Array<any>;

  public readonly __diff__?: Array<any>;

}
