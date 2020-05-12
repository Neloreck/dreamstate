import { useContext } from "react";

import { IContextManagerConstructor } from "../types";
import { useContextWithMemo } from "./useContextWithMemo";

/**
 * Use manager hook, higher order wrapper for useContext.
 */
export function useManager<T extends object, D extends IContextManagerConstructor<T>>(
  Manager: D,
  depsSelector?: (context: D["prototype"]["context"]) => Array<any>
): D["prototype"]["context"] {
  if (depsSelector) {
    return useContextWithMemo(Manager, depsSelector);
  } else {
    return useContext(Manager.REACT_CONTEXT);
  }
}
