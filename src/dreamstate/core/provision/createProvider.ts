import { FunctionComponent } from "react";

import { createCombinedProvider } from "@/dreamstate/core/provision/combined/createCombinedProvider";
import { createScopedProvider } from "@/dreamstate/core/provision/scoped/createScopedProvider";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { IContextManagerConstructor, TAnyObject } from "@/dreamstate/types";
import { IProviderProps } from "@/dreamstate/types/provision";

/**
 * Provider creation configuration object.
 */
export interface ICreateProviderProps {
  isCombined?: boolean;
}

/**
 * Method for provision component creation.
 * Observes context changes and uses react context for data provision.
 * All data can be consumed anywhere in react tree below created provider component with useManager/useContext hooks.
 *
 * @param {Array.<IContextManagerConstructor>>} sources - array of source classes references
 *   that should be provided in react tree when returned component renders
 * @param {Object} config - store provider configuration
 * @param {boolean} config.isCombined - boolean flag that switches observing between one big react node
 *   vs small scoped nodes
 *
 * @returns {FunctionComponent} react provider component for source classes
 *
 * @throws {TypeError} - wrong sources param type supplied, should be array
 * @throws {TypeError} - wrong source object in array supplied, should be class extending ContextManager
 */
export function createProvider<
  T extends TAnyObject = TAnyObject
>(
  sources: Array<IContextManagerConstructor>,
  config: ICreateProviderProps = {}
): FunctionComponent<IProviderProps<T>> {
  /**
   * Validate provision sources parameter.
   * Supplied 'sources' should contain array of context manager class references.
   */
  if (!Array.isArray(sources) || !sources.length) {
    throw new TypeError(
      "Wrong providers parameter supplied. Only non-empty array of context managers is acceptable."
    );
  }

  /**
   * Validate provision sources on creation stage before actual component rendering.
   * All classes should be valid context managers with correct metadata and core methods.
   */
  for (let it = 0; it < sources.length; it ++) {
    if (!sources[it] || !(sources[it].prototype instanceof ContextManager)) {
      throw new TypeError("Only classes extending ContextManager can be supplied for provision.");
    }
  }

  /**
   * Supply two different versions of provision creation.
   * Combined - pre v4 variant with single observer.
   * Scoped - new v4 variant with separated react nodes.
   *
   * todo: Later do proper performance checks and benchmarks to tell which one is better.
   */
  if (config.isCombined === false) {
    return createScopedProvider(sources);
  } else {
    return createCombinedProvider(sources);
  }
}
