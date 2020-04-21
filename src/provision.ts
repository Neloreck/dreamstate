import { ComponentType, FunctionComponent } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { MethodDescriptor, TAnyContextManagerConstructor } from "./types";
import { createManagersObserver } from "./observing";

import { log } from "./macroses/log.macro";

/**
 * Decorator factory.
 * Provide context from context managers.
 * Observes changes and uses default react Providers for data flow.
 *
 * Creates legacy or proposal decorator based on used environment.
 */
export function Provide (sources: Array<TAnyContextManagerConstructor>) {
  // Support legacy and proposal decorators. Create observer of requested managers.
  return function(classOrDescriptor: ComponentType<any>) {
    if (typeof classOrDescriptor === "function") {
      log.info(`Creating legacy provide decorator for ${sources.length} sources. Target:`, classOrDescriptor.name);
      return hoistNonReactStatics(createManagersObserver(classOrDescriptor, sources), classOrDescriptor);
    } else {
      (classOrDescriptor as MethodDescriptor).finisher = function (wrappedComponent: ComponentType) {
        log.info(`Creating proposal consume decorator for ${sources.length} sources. Target:`, wrappedComponent.name);
        return hoistNonReactStatics(createManagersObserver(wrappedComponent, sources), wrappedComponent);
      } as any;

      return classOrDescriptor;
    }
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
export function createProvider (sources: Array<TAnyContextManagerConstructor>): FunctionComponent<{}> {
  log.info(`Creating functional provider for ${sources.length} sources.`);

  return createManagersObserver(null, sources);
}
