import { ComponentType, createElement, FunctionComponent, memo, ReactElement, useCallback, useState } from "react";
import { default as hoistNonReactStatics } from "hoist-non-react-statics";

import { ClassDescriptor, IStringIndexed, TAnyContextManagerConstructor, TConsumable } from "./types";
import { EMPTY_ARR, EMPTY_STRING, IDENTIFIER_KEY, MANAGER_REGEX, STORE_REGISTRY } from "./internals";
import { useLazyInitializeManager } from "./observing";

declare const IS_DEV: boolean;

/**
 * Subtree provider as global scope helper.
 */
export function provideSubTree(current: number, bottom: ReactElement, sources: Array<TAnyContextManagerConstructor>): ReactElement {
  return (
    current >= sources.length
      ? bottom
      : createElement(
      sources[current].getContextType().Provider,
      { value: STORE_REGISTRY.STATES[sources[current][IDENTIFIER_KEY]] },
      provideSubTree(current + 1, bottom, sources)
      )
  );
}

/**
 * Utility method for observers creation.
 */
export function createManagersObserver(children: ComponentType | null, sources: Array<TAnyContextManagerConstructor>) {
  // Create observer component that will handle observing.
  function Observer(props: IStringIndexed<any>): ReactElement {
    // Update providers subtree utility.
    const [ , updateState ] = useState();
    const updateProviders = useCallback(function () { updateState({}); }, EMPTY_ARR);
    // Subscribe to tree updater and lazily get first context value.
    for (let it = 0; it < sources.length; it ++) {
      useLazyInitializeManager(sources[it], updateProviders);
    }

    return provideSubTree(0, (children ? createElement(children, props) : props.children), sources);
  }

  if (IS_DEV) {
    Observer.displayName = `Dreamstate.Observer.[${sources.map((it: TConsumable<any>) => it.name.replace(MANAGER_REGEX, EMPTY_STRING) )}]`;
  } else {
    Observer.displayName = "DS.Observer";
  }

  // Hoc helper for decorated components to prevent odd renders.
  return memo(Observer) as any;
}

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
    return ((typeof classOrDescriptor === 'function'))
      ? hoistNonReactStatics(createManagersObserver(classOrDescriptor, sources), classOrDescriptor)
      : ({
        ...(classOrDescriptor as ClassDescriptor),
        finisher: (wrappedComponent: ComponentType) => hoistNonReactStatics(createManagersObserver(wrappedComponent, sources), wrappedComponent)
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
