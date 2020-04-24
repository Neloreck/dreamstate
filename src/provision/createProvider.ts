import { FunctionComponent } from "react";

import { TAnyContextManagerConstructor } from "../types";
import { createManagersObserver } from "../observing";

/**
 * Create component for manual provision without HOC/Decorator-like api.
 * Useful if your root is functional component or you are using createComponent api without JSX.
 */
export function createProvider(sources: Array<TAnyContextManagerConstructor>): FunctionComponent<object> {
  return createManagersObserver(null, sources);
}
