import { ComponentType, FunctionComponent } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { TAnyContextManagerConstructor } from "./types";
import { createManagersObserver } from "./observing";

import { createClassWrapDecorator } from "./polyfills/decorate";

/**
 * Decorator factory.
 * Provide context from context managers.
 * Observes changes and uses default react Providers for data flow.
 */
export function Provide<T extends ComponentType>(
  sources: Array<TAnyContextManagerConstructor>
): ClassDecorator {
  return createClassWrapDecorator(function (targetClass: T): T {
    return hoistNonReactStatics(createManagersObserver(targetClass, sources), targetClass);
  });
}

/**
 * HOC alias for @Provide.
 */
export const withProvision = Provide;

/**
 * Create component for manual provision without HOC/Decorator-like api.
 * Useful if your root is functional component or you are using createComponent api without JSX.
 */
export function createProvider (sources: Array<TAnyContextManagerConstructor>): FunctionComponent<object> {
  return createManagersObserver(null, sources);
}
