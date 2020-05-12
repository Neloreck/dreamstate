import { ComponentType } from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { createManagersObserver } from "../observing";
import { createClassWrapDecorator } from "../polyfills";
import { TDreamstateService } from "../types";

/**
 * Decorator factory.
 * Provide context from context managers.
 * Observes changes and uses default react Providers for data flow.
 */
export function Provide<T extends ComponentType>(
  sources: Array<TDreamstateService>
): ClassDecorator {
  return createClassWrapDecorator(function(targetClass: T): T {
    return hoistNonReactStatics(createManagersObserver(targetClass, sources), targetClass);
  });
}
