import { Context } from "react";

import { TAnyContextManagerConstructor } from "@Lib/types";

/**
 * Get react provider of selected context manager.
 */
export function getReactProvider<T extends TAnyContextManagerConstructor>(
  Manager: T
): Context<T["prototype"]["context"]>["Provider"] {
  return Manager.REACT_CONTEXT.Provider;
}
