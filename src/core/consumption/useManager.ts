import { useContextWithMemo } from "@Lib/core/consumption/useContextWithMemo";
import { IContextManagerConstructor } from "@Lib/core/types";
import { useContext } from "react";


/**
 * Use manager hook, higher order wrapper for useContext.
 */
export function useManager<T extends object, D extends IContextManagerConstructor<T>>(
  Manager: D,
  depsSelector?: (context: T) => Array<any>
): T {
  if (depsSelector) {
    return useContextWithMemo(Manager, depsSelector);
  } else {
    return useContext(Manager.REACT_CONTEXT);
  }
}
