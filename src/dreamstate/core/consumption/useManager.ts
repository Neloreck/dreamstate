import { useContext } from "react";

import { useContextWithMemo } from "@/dreamstate/core/consumption/useContextWithMemo";
import { IContextManagerConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Use manager hook, higher order wrapper for useContext.
 */
export function useManager<
  T extends TAnyObject,
  D extends IContextManagerConstructor<T, any>
>(
  Manager: D,
  depsSelector?: (context: D["prototype"]["context"]) => Array<any>
): D["prototype"]["context"] {
  if (depsSelector) {
    return useContextWithMemo(Manager, depsSelector);
  } else {
    return useContext(Manager.REACT_CONTEXT);
  }
}
