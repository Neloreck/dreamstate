import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { ActionsStore } from "@/dreamstate/core/storing/ActionsStore";
import { EDreamstateErrorCode, TAnyObject } from "@/dreamstate/types";
import { isObject } from "@/dreamstate/utils/typechecking";

/**
 * Creates an actions store, which is an object containing readonly method links representing actions.
 * The intention is to provide a container that is visually and programmatically distinguishable as
 * a storage of actions.
 *
 * Every call to 'setContext' will perform a comparison of the current 'context' before updating,
 * excluding the actions object, as it is expected to be immutable and consistent.
 *
 * @template T The type of actions object.
 * @param {T} actions - An object containing a set of mutation operations (actions).
 * @returns {Readonly<T>} An instance of an ActionsStore class containing the supplied actions.
 */
export function createActions<T extends TAnyObject>(actions: T): Readonly<T> {
  if (isObject(actions)) {
    return new ActionsStore<T>(actions) as Readonly<T>;
  } else {
    throw new DreamstateError(
      EDreamstateErrorCode.INCORRECT_PARAMETER,
      `Actions store should be initialized with an object, got '${typeof actions}' instead.`
    );
  }
}
