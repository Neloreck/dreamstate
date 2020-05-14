import { TAnyContextManagerConstructor } from "@Lib/core/types";
import { Context } from "react";


/**
 * Get react provider of selected context manager.
 */
export function getReactProvider<T extends TAnyContextManagerConstructor>(
  Manager: T
): Context<T["prototype"]["context"]>["Provider"] {
  return Manager.REACT_CONTEXT.Provider;
}
