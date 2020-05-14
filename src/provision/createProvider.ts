import { FunctionComponent } from "react";

import { createManagersObserver } from "@Lib/observing/createManagersObserver";
import { TDreamstateService } from "@Lib/types";

/**
 * Create component for manual provision without HOC/Decorator-like api.
 * Useful if your root is functional component or you are using createComponent api without JSX.
 */
export function createProvider(
  sources: Array<TDreamstateService>
): FunctionComponent<object> {
  return createManagersObserver(null, sources);
}
