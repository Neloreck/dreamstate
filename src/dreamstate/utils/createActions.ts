import { ActionsStore } from "@/dreamstate/core/storing/ActionsStore";
import { TAnyObject } from "@/dreamstate/types";
import { isObject } from "@/dreamstate/utils/typechecking";

/**
 * Create actions store that is readonly action-links containing object.
 * Marks nested it as never updating.
 * Every 'setContext' call comparison of current 'context' before actual update will not check actions objects.
 *
 * @param {Object} actions - object containing set of mutation operations.
 * @returns instance of ActionsStore class containing supplied actions.
 */
export function createActions<T extends TAnyObject>(actions: T): Readonly<T> {
  if (isObject(actions)) {
    return new ActionsStore<T>(actions) as Readonly<T>;
  } else {
    throw new TypeError(`Actions store should be initialized with actions object, got ${typeof actions} instead.`);
  }
}
