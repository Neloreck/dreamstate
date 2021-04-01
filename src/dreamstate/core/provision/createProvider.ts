import { FunctionComponent } from "react";

import { createManagersObserver } from "@/dreamstate/core/observing/createManagersObserver";
import { TAnyObject, TDreamstateService } from "@/dreamstate/types";

/**
 * Create component for manual provision without HOC/Decorator-like api.
 * Useful if your root is functional component or you are using createComponent api without JSX.
 */
export function createProvider<
  T extends TAnyObject = TAnyObject
>(
  sources: Array<TDreamstateService<any>>
): FunctionComponent<TAnyObject & { initialState?: T }> {
  return createManagersObserver(null, sources);
}
