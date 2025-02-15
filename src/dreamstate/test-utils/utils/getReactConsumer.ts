import { Context } from "react";

import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Retrieves the React context consumer for the specified context manager.
 *
 * @template T - The type of the context manager constructor.
 * @param {T} ManagerClass - The constructor reference of the context manager.
 * @returns {Context<T["prototype"]["context"]>["Consumer"]} The React context consumer for the specified manager class.
 */
export function getReactConsumer<T extends TAnyContextManagerConstructor>(
  ManagerClass: T
): Context<T["prototype"]["context"]>["Consumer"] {
  return ManagerClass.REACT_CONTEXT.Consumer;
}
