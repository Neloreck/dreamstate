import { TAnyContextManagerConstructor } from "@Lib/core/types";
import { Context } from "react";


/**
 * Get react provider of selected context manager.
 */
export function getReactConsumer<T extends TAnyContextManagerConstructor>(
  Manager: T
): Context<T["prototype"]["context"]>["Consumer"] {
  return Manager.REACT_CONTEXT.Consumer;
}
