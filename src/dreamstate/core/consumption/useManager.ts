import { useContext } from "react";

import { useContextWithMemo } from "@/dreamstate/core/consumption/useContextWithMemo";
import { IContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Custom hook that wraps `useContext` to provide scoped context data with optional update
 * optimization via a dependency selector. It returns the context from the specified manager
 * class and limits re-renders to changes in selected dependencies.
 *
 * @template T - The type of the context state.
 * @template D - The type of the context manager constructor.
 * @param {D} ManagerClass - The manager class whose instance context is returned.
 * @param {(context: D["prototype"]["context"]) => any[]} [dependenciesSelector] - An optional function
 *   that receives the current context and returns an array of dependencies. The component re-renders
 *   only if values in this array change. Without it, the component updates on every context change.
 * @returns {D["prototype"]["context"]} The context data provided by the manager within the current
 *   dreamstate scope.
 */
export function useManager<T extends TAnyObject, D extends IContextManagerConstructor<T>>(
  ManagerClass: D,
  dependenciesSelector?: (context: D["prototype"]["context"]) => Array<any>
): D["prototype"]["context"] {
  /*
   * Use pub-sub + checking approach only if dependency selector was provided.
   * If component should update on every change there is no point of doing anything additional to default context.
   */
  return dependenciesSelector
    ? useContextWithMemo<T, D>(ManagerClass, dependenciesSelector)
    : useContext(ManagerClass.REACT_CONTEXT);
}
