import { Context } from "react";

import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Get react provider of selected context manager.
 *
 * @param {TAnyContextManagerConstructor} ManagerClass - context manager class reference.
 *
 * @return {Context.Provider} context provider reference for specified manager class.
 */
export function getReactProvider<T extends TAnyContextManagerConstructor>(
  ManagerClass: T
): Context<T["prototype"]["context"]>["Provider"] {
  return ManagerClass.REACT_CONTEXT.Provider;
}
