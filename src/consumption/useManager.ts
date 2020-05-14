import { useContext } from "react";

import { IContextManagerConstructor } from "@Lib/types";
import { useContextWithMemo } from "@Lib/consumption/useContextWithMemo";

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
