import { FunctionComponent } from "react";

import { createManagersObserver } from "@/dreamstate/core/observing/createManagersObserver";
import { TAnyContextServiceConstructor, TAnyObject } from "@/dreamstate/types";

/**
 * Create component for manual provision without HOC/Decorator-like api.
 * Useful if your root is functional component or you are using createComponent api without JSX.
 */
export function createProvider<
  T extends TAnyObject = TAnyObject
>(
  sources: Array<TAnyContextServiceConstructor>
): FunctionComponent<TAnyObject & { initialState?: T, hotUpdates?: boolean; }> {
  return createManagersObserver(null, sources);
}
