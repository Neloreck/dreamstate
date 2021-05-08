import { useContext } from "react";

import { useContextWithMemo } from "@/dreamstate/core/consumption/useContextWithMemo";
import { IContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Callback for dependencies composing based on current context.
 *
 * @callback contextDependenciesSelector
 * @param {Object} context
 * @return {Array} dependencies
 */

/**
 * Use manager hook, wrapper for useContext that maintains scoping and does data injection.
 *
 * @param {IContextManagerConstructor} ManagerClass - manager class reference which instance context should be returned
 * @param {contextDependenciesSelector} [dependenciesSelector] - optional function that receives current context and
 *   returns selected dependencies array. It is used with same logic as hook dependencies do for update checks.
 *   Selector is called after every context update but actual component re-render will happen only
 *   if something in resulting array has changed. Component will update on every change if selector was not provided.
 */
export function useManager<
  T extends TAnyObject,
  D extends IContextManagerConstructor<T>
>(
  ManagerClass: D,
  dependenciesSelector?: (context: D["prototype"]["context"]) => Array<any>
): D["prototype"]["context"] {
  if (dependenciesSelector) {
    return useContextWithMemo<T, D>(ManagerClass, dependenciesSelector);
  } else {
    return useContext(ManagerClass.REACT_CONTEXT);
  }
}
