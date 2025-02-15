import { createElement, ReactElement, ReactNode, useEffect, useMemo } from "react";

import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { useForceUpdate } from "@/dreamstate/core/utils/useForceUpdate";
import { TAnyContextManagerConstructor, TAnyObject, TCallable } from "@/dreamstate/types";

export interface IScopedObserverProps<T> {
  ManagerClass: TAnyContextManagerConstructor;
  children?: ReactNode;
  dependencies: Array<TAnyContextManagerConstructor>;
  initialState?: T;
  scope: IScopeContext;
}

/**
 * A component that provides data for a specific context manager within an isolated React node.
 *
 * This component is responsible for observing changes within a specific scope and providing the
 * context data for the given context manager (`ManagerClass`). It allows for isolated data provisioning
 * and is useful for managing specific parts of the application state while preventing unnecessary
 * re-renders of unrelated components.
 *
 * @template T - The type of the context data to be provided by the `ManagerClass`.
 * @param {object} props - The props for the component.
 * @param {ReactNode} props.children - The child components that will receive the provided context data.
 * @param {TAnyObject | undefined} props.initialState - The initial state to be provided for the context manager.
 * @param {Array<unknown>} props.dependencies - The dependencies used to determine when the component should
 *   re-render, typically when specific context data changes.
 * @param {TAnyContextManagerConstructor} props.ManagerClass - The context manager class reference that will provide
 *   the data to the component.
 * @param {string} props.scope - The scope information that defines the context and its relationship to other parts
 *   of the application.
 * @returns {ReactElement} A React element that provides the context data for the specified `ManagerClass`
 *   within the defined scope.
 */
export function ScopedProvider<T extends TAnyObject>({
  children,
  initialState,
  dependencies,
  ManagerClass,
  scope,
}: IScopedObserverProps<T>): ReactElement {
  const forceUpdate: TCallable = useForceUpdate();

  /*
   * Use memo for first and single init of required components.
   * The point is to force registering before provider rendering for first init.
   *
   * Registering will work in the same way even if it is called multiple times.
   * Dependencies array is mostly used for HMR updates to force reloading on class reference changes.
   */
  useMemo(function(): void {
    scope.INTERNAL.registerService(ManagerClass, initialState);
  }, dependencies);

  /*
   * Mount current observers and trigger related lifecycle methods when needed.
   * Count references of providers to detect whether we start provisioning or ending it.
   *
   * ! Dependencies array is mostly used for HMR updates to force reloading on class reference changes.
   */
  useEffect(function(): TCallable {
    const isRegistered: boolean = scope.INTERNAL.registerService(ManagerClass, initialState);

    scope.INTERNAL.addServiceObserver(ManagerClass, forceUpdate);

    /*
     * Re-sync scope provider if it was registered.
     * Normally happens with HMR chunks exchange and caused problems that use react context without subscription.
     * Required to force render of subscribed components after HMR with newest fast-refresh plugins.
     */
    if (isRegistered) {
      forceUpdate();
    }

    return function(): void {
      scope.INTERNAL.removeServiceObserver(ManagerClass, forceUpdate);
    };
  }, dependencies);

  /*
   * Create simple react provider based on current ManagerClass and provide data from scope registry.
   */
  return createElement(
    ManagerClass.REACT_CONTEXT.Provider,
    {
      value: scope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY.get(ManagerClass),
    },
    children
  );
}

/*
 * Easier devtools usage for dev environment.
 */
if (IS_DEV) {
  ScopedProvider.displayName = "Dreamstate.ScopedProvider";
}
