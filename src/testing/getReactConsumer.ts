import { Context } from "react";

import { TAnyContextManagerConstructor } from "@Lib/types";

/**
 * Get react provider of selected context manager.
 */
export function getReactConsumer<T extends TAnyContextManagerConstructor>(
  Manager: T
): Context<T["prototype"]["context"]>["Consumer"] {
  return Manager.REACT_CONTEXT.Consumer;
}
