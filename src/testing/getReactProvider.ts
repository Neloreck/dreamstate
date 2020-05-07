import { Context } from "react";

import { TAnyContextManagerConstructor } from "../types";

/**
 * Get react provider of selected context manager.
 */
export function getReactProvider<T extends TAnyContextManagerConstructor>(
  managerConstructor: T
): Context<T["prototype"]["context"]>["Provider"] {
  return managerConstructor.REACT_CONTEXT.Provider;
}
