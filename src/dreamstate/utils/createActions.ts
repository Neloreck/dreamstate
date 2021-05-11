import { ActionsStore } from "@/dreamstate/core/storing/ActionsStore";

/**
 * Create actions store that is readonly action-links containing object.
 */
export function createActions<T>(actions: T): Readonly<T> {
  return new ActionsStore<T>(actions) as Readonly<T>;
}
