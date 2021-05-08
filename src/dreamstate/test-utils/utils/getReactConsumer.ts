import { Context } from "react";

import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Get react consumer of selected context manager.
 *
 * @param {TAnyContextManagerConstructor} ManagerClass - context manager class reference.
 *
 * @return {Context.Consumer} context consumer reference for specified manager class.
 */
export function getReactConsumer<T extends TAnyContextManagerConstructor>(
  ManagerClass: T
): Context<T["prototype"]["context"]>["Consumer"] {
  return ManagerClass.REACT_CONTEXT.Consumer;
}
