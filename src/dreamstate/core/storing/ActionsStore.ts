/**
 * Class for nested action values.
 * Used by context diff checker on updates by ContextManager class.
 */
import { TAnyObject } from "@/dreamstate/types";

export class ActionsStore<T extends TAnyObject = TAnyObject> {
  public constructor(actions: T) {
    Object.assign(this, actions);
  }
}
