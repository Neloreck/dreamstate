import { useContext } from "react";

import { useContextWithMemo } from "@/dreamstate/core/consumption/useContextWithMemo";
import { IContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Callback for dependencies composing based on current context.
 *
 * @callback contextDependenciesSelector
 * @param {Object} - context.
 * @returns {Array} dependencies.
 */

/**
 * Use manager hook, wrapper for useContext that maintains scoping and does data injection.
 *
 * @param {IContextManagerConstructor} ManagerClass - manager class reference which instance context should be returned.
 * @param {contextDependenciesSelector} [dependenciesSelector] - optional function that receives current context and
 *   returns selected dependencies array. It is used with same logic as hook dependencies do for update checks.
 *   Selector is called after every context update but actual component re-render will happen only
 *   if something in resulting array has changed. Component will update on every change if selector was not provided.
 * @returns context data of ManagerClass in current dreamstate scope.
 */
export function useManager<T extends TAnyObject, D extends IContextManagerConstructor<T>>(
  ManagerClass: D,
  dependenciesSelector?: (context: D["prototype"]["context"]) => Array<any>
): D["prototype"]["context"] {
  /**
   * Fallback to pub-sub + checking approach only if dependency selector was provided.
   * If component should update on every change there is no point of doing anything additional to default context.
   *
   * todo: Dev warning with ManagerClass check?
   */
  if (dependenciesSelector) {
    return useContextWithMemo<T, D>(ManagerClass, dependenciesSelector);
  } else {
    return useContext(ManagerClass.REACT_CONTEXT);
  }
}
