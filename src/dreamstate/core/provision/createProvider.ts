import { FunctionComponent } from "react";

import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { ContextManager } from "@/dreamstate/core/management/ContextManager";
import { createCombinedProvider } from "@/dreamstate/core/provision/combined/createCombinedProvider";
import { createScopedProvider } from "@/dreamstate/core/provision/scoped/createScopedProvider";
import { EDreamstateErrorCode, IContextManagerConstructor, TAnyObject } from "@/dreamstate/types";
import { IProviderProps } from "@/dreamstate/types/provision";

export interface ICreateProviderProps {
  /**
   * A flag that determines whether to observe the context changes in one large React node
   *   or as smaller scoped nodes for better performance.
   */
  isCombined?: boolean;
}

/**
 * Method for creation of a component that provides React contexts and observes context changes.
 *
 * This function generates a React provider component that listens to changes in context state,
 * using the provided context managers and their corresponding configurations. The created provider
 * component can be used to wrap parts of the React component tree, making data from the context managers
 * available to all components within the tree via hooks like `useManager` and `useContext`.
 *
 * @param {Array<IContextManagerConstructor>} sources - An array of context manager class references
 *   that should be provided as context in the React tree when the returned provider component renders.
 * @param {ICreateProviderProps} config - Configuration options for the store provider.
 * @param {boolean} config.isCombined - A flag that determines whether to observe the context changes
 *   in one large React node or as smaller scoped nodes for better performance.
 * @returns {FunctionComponent} A React function component that acts as a provider for the specified
 *   context manager classes, making their data accessible to the React tree.
 *
 * @throws {TypeError} If the `sources` parameter is not an array.
 * @throws {TypeError} If any object in the `sources` array is not a class that extends `ContextManager`.
 */
export function createProvider<T extends TAnyObject = TAnyObject>(
  sources: Array<IContextManagerConstructor>,
  config: ICreateProviderProps = {}
): FunctionComponent<IProviderProps<T>> {
  /*
   * Validate provision sources parameter.
   * Supplied 'sources' should contain array of context manager class references.
   */
  if (!Array.isArray(sources) || !sources.length) {
    throw new DreamstateError(
      EDreamstateErrorCode.INCORRECT_PARAMETER,
      "Only array of context managers is acceptable."
    );
  }

  /*
   * Validate provision sources on creation stage before actual component rendering.
   * All classes should be valid context managers with correct metadata and core methods.
   */
  for (let it = 0; it < sources.length; it ++) {
    if (!sources[it] || !(sources[it].prototype instanceof ContextManager)) {
      throw new DreamstateError(
        EDreamstateErrorCode.TARGET_CONTEXT_MANAGER_EXPECTED,
        `'${String(sources[it])}' is in sources array.`
      );
    }
  }

  /*
   * Supply two different versions of provision creation.
   * Combined - pre v4 variant with single observer.
   * Scoped - new v4 variant with separated react nodes.
   */
  return config.isCombined ? createCombinedProvider(sources) : createScopedProvider(sources);
}
