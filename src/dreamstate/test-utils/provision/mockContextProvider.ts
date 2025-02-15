import { createElement, FunctionComponent, Provider, ReactNode } from "react";

import { createProvider, ICreateProviderProps } from "@/dreamstate/core/provision/createProvider";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { mockScopeProvider } from "@/dreamstate/test-utils/provision/mockScopeProvider";
import { mockScope } from "@/dreamstate/test-utils/registry/mockScope";
import { IContextManagerConstructor, TAnyObject } from "@/dreamstate/types";
import { IProviderProps } from "@/dreamstate/types/provision";

/**
 * Creates a mock context provider that constructs instances without firing provision events.
 * This is useful for testing or mocking tree provision where required.
 *
 * @template T - The type of the provided context value, defaults to `TAnyObject`.
 * @param {IContextManagerConstructor[]} sources - An array of context manager constructors that should be
 *   provided within the React tree when the returned component renders.
 * @param {ICreateProviderProps} config - Configuration for the store provider.
 * @param {boolean} config.isCombined - Determines whether to use a single large React node for observing
 *   changes or multiple smaller scoped nodes.
 * @param {IScopeContext} scope - The scope where providers should be injected. Uses a mocked scope by default.
 * @returns {FunctionComponent<IProviderProps<T>>} A mocked React provider component that provides the source
 *   classes within the mocked scope.
 */
export function mockContextProvider<T extends TAnyObject = TAnyObject>(
  sources: Array<IContextManagerConstructor>,
  config: ICreateProviderProps = {},
  scope: IScopeContext = mockScope()
): FunctionComponent<IProviderProps<T>> {
  const scopeProviderProps: { value: IScopeContext } = { value: scope };
  const ContextProvider: FunctionComponent<IProviderProps<T>> = createProvider(sources, config);
  const ScopeProvider: Provider<IScopeContext> = mockScopeProvider();

  /*
   * Create provider component that can be used by react to automatically inject specific scope.
   */
  function MockedProvider(props: T): ReactNode {
    return createElement(ScopeProvider, scopeProviderProps, createElement(ContextProvider, props));
  }

  /*
   * Indicate that following provider is mocked.
   */
  MockedProvider.displayName = "MockedProvider";

  return MockedProvider as FunctionComponent<IProviderProps<T>>;
}
