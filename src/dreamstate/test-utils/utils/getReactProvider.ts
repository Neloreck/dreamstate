import { Context } from "react";

import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Retrieves the React context provider for the specified context manager.
 *
 * @template T - The type of the context manager constructor.
 * @param {T} ManagerClass - The constructor reference of the context manager.
 * @returns {Context<T["prototype"]["context"]>["Provider"]} The React context provider for the specified manager class.
 */
export function getReactProvider<T extends TAnyContextManagerConstructor>(
  ManagerClass: T
): Context<T["prototype"]["context"]>["Provider"] {
  return ManagerClass.REACT_CONTEXT.Provider;
}
