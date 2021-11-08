import { ActionsStore } from "@/dreamstate/core/storing/ActionsStore";
import { TAnyObject } from "@/dreamstate/types";
import { isObject } from "@/dreamstate/utils/typechecking";

/**
 * Create actions store.
 * Actions store is readonly methods links containing object.
 * Intention of this function is to create container that is visually and programmatically distinguishable as
 *   actions containing sub-storage.
 *
 * Every 'setContext' call comparison of current 'context' before update will not check actions objects,
 *   it expects it to be immutable and same all the time.
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
