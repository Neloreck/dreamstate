import { ComponentType, FunctionComponent } from "react";
import { default as hoistNonReactStatics } from "hoist-non-react-statics";

import { ClassDescriptor, TAnyContextManagerConstructor } from "./types";
import { createManagersObserver } from "./observing";

/**
 * Decorator factory.
 * Provide context from context managers.
 * Observes changes and uses default react Providers for data flow.
 *
 * Creates legacy or proposal decorator based on used environment.
 */
export function Provide (...sources: Array<TAnyContextManagerConstructor>) {
  // Support legacy and proposal decorators. Create observer of requested managers.
  return function(classOrDescriptor: ComponentType<any>) {
    return ((typeof classOrDescriptor === "function"))
      ? hoistNonReactStatics(createManagersObserver(classOrDescriptor, sources), classOrDescriptor)
      : ({
        ...(classOrDescriptor as ClassDescriptor),
        finisher: (wrappedComponent: ComponentType) =>
          hoistNonReactStatics(createManagersObserver(wrappedComponent, sources), wrappedComponent)
      });
  };
}

/**
 * HOC alias for @Provide.
 */
export const withProvision = Provide;

/**
 * Create component for manual provision without HOC/Decorator-like api.
 * Useful if your root is functional component or you are using createComponent api without JSX.
 */
export function createProvider (...sources: Array<TAnyContextManagerConstructor>): FunctionComponent<{}> {
  return createManagersObserver(null, sources);
}
