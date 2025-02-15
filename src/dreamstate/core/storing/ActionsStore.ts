import { TAnyObject } from "@/dreamstate/types";

/**
 * A utility class for storing and managing nested action values.
 *
 * This class is primarily used by the `ContextManager` to track and avoid comparing actions during context updates.
 * It helps in detecting differences in state changes efficiently.
 */
export class ActionsStore<T extends TAnyObject = TAnyObject> {
  public constructor(actions: T) {
    Object.assign(this, actions);
  }
}
