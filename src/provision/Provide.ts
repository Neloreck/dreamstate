import { ComponentType } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { TAnyContextManagerConstructor } from "../types";
import { createManagersObserver } from "../observing";
import { createClassWrapDecorator } from "../polyfills";

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
