import { default as hoistNonReactStatics } from "hoist-non-react-statics";
import { ComponentType } from "react";

import { createManagersObserver } from "@/dreamstate/core/observing/createManagersObserver";
import { createClassWrapDecorator } from "@/dreamstate/polyfills/createClassWrapDecorator";
import { TAnyContextServiceConstructor } from "@/dreamstate/types";

/**
 * Decorator factory.
 * Provide context from context managers.
 * Observes changes and uses default react Providers for data flow.
 */
export function Provide<T extends ComponentType>(
  sources: Array<TAnyContextServiceConstructor>
): ClassDecorator {
  return createClassWrapDecorator(function(targetClass: T): T {
    return hoistNonReactStatics(createManagersObserver(targetClass, sources), targetClass);
  });
}
