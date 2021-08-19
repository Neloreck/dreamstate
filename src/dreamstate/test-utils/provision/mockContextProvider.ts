import { createElement, FunctionComponent, Provider, ReactNode } from "react";

import { createProvider, ICreateProviderProps } from "@/dreamstate/core/provision/createProvider";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { mockScopeProvider } from "@/dreamstate/test-utils/provision/mockScopeProvider";
import { mockScope } from "@/dreamstate/test-utils/registry/mockScope";
import { IContextManagerConstructor, TAnyObject } from "@/dreamstate/types";
import { IProviderProps } from "@/dreamstate/types/provision";

/**
 * Mock context provider that does not fire provision event and just constructs instances.
 * Can be used to mock tree provision where required.
 *
 * @param {Array.<IContextManagerConstructor>>} sources - array of source classes references
 *   that should be provided in react tree when returned component renders.
 * @param {ICreateProviderProps} config - store provider configuration.
 * @param {boolean} config.isCombined - boolean flag that switches observing between one big react node
 *   vs small scoped nodes.
 * @param {IScopeContext} scope - scope where providers should be injected, mocked by default.
 * @returns {FunctionComponent} mocked react provider component for source classes in mocked scope.
 */
export function mockContextProvider<T extends TAnyObject = TAnyObject>(
  sources: Array<IContextManagerConstructor>,
  config: ICreateProviderProps = {},
  scope: IScopeContext = mockScope()
): FunctionComponent<IProviderProps<T>> {
  const scopeProviderProps: { value: IScopeContext } = { value: scope };
  const ContextProvider: FunctionComponent<IProviderProps<T>> = createProvider(sources, config);
  const ScopeProvider: Provider<IScopeContext> = mockScopeProvider();

  /**
   * Create provider component that can be used by react to automatically inject specific scope.
   */
  function MockedProvider(props: T): ReactNode {
    return createElement(ScopeProvider, scopeProviderProps, createElement(ContextProvider, props));
  }

  /**
   * Indicate that following provider is mocked.
   */
  MockedProvider.displayName = "MockedProvider";

  return MockedProvider as FunctionComponent<IProviderProps<T>>;
}
