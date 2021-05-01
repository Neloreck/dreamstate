import { ActionsStore } from "@/dreamstate/core/storing/ActionsStore";

/**
 * Create computed value that will be populated after each update.
 */
export function createActions<T>(actions: T): Readonly<T> {
  return Object.assign(
    new ActionsStore(),
    actions
  );
}
