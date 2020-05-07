import { TAnyContextManagerConstructor } from "../types";
import { Context } from "react";

/**
 * Get react provider of selected context manager.
 */
export function getReactConsumer<T extends TAnyContextManagerConstructor>(
  managerConstructor: T
): Context<T["prototype"]["context"]>["Consumer"] {
  return managerConstructor.REACT_CONTEXT.Consumer;
}
