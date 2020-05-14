
import { createManagersObserver } from "@Lib/core/observing/createManagersObserver";
import { TDreamstateService } from "@Lib/core/types";
import { FunctionComponent } from "react";

/**
 * Create component for manual provision without HOC/Decorator-like api.
 * Useful if your root is functional component or you are using createComponent api without JSX.
 */
export function createProvider(
  sources: Array<TDreamstateService>
): FunctionComponent<object> {
  return createManagersObserver(null, sources);
}
