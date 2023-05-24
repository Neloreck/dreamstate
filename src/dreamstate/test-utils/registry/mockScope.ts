import { initializeScopeContext } from "@/dreamstate/core/scoping/initializeScopeContext";
import { createRegistry, IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { IS_MOCKED } from "@/dreamstate/test-utils/internals";
import {
  IContextManagerConstructor,
  TAnyContextManagerConstructor,
  TAnyObject,
  TUpdateObserver
} from "@/dreamstate/types";

export interface IMockScopeConfig {
  isLifecycleDisabled?: boolean;
  applyInitialContexts?: Array<[TAnyContextManagerConstructor, TAnyObject]>;
}

/**
 * Mock scope with clean initial state.
 * Can be used to mock whole scope context and run some advanced tests.
 *
 * @param {IMockScopeConfig} mockConfig - configuration object for scope mocking.
 * @param {IRegistry} registry - optional custom registry that will be used as scope storage.
 * @returns {IScopeContext} mocked scope context.
 */
export function mockScope(mockConfig: IMockScopeConfig = {}, registry: IRegistry = createRegistry()): IScopeContext {
  const { isLifecycleDisabled = true, applyInitialContexts = [] } = mockConfig;
  const appliedContexts: Map<TAnyContextManagerConstructor, TAnyObject> = new Map(applyInitialContexts);
  const scope: IScopeContext = initializeScopeContext(registry);

  /**
   * Mark scope as mocked.
   */
  Object.defineProperty(scope, IS_MOCKED, { value: true });

  /**
   * Mock service observer methods to exclude provision events from lifecycle.
   */
  if (isLifecycleDisabled) {
    const addServiceObserver = scope.INTERNAL.addServiceObserver;
    const removeServiceObserver = scope.INTERNAL.removeServiceObserver;

    scope.INTERNAL.addServiceObserver = function(
      ManagerClass: TAnyContextManagerConstructor,
      serviceObserver: TUpdateObserver
    ): void {
      return addServiceObserver(ManagerClass, serviceObserver, -1);
    };

    scope.INTERNAL.removeServiceObserver = function(
      ManagerClass: TAnyContextManagerConstructor,
      serviceObserver: TUpdateObserver
    ): void {
      return removeServiceObserver(ManagerClass, serviceObserver, -1);
    };
  }

  /**
   * Mock post-register contexts.
   */
  if (appliedContexts.size) {
    const registerService = scope.INTERNAL.registerService;

    /**
     * On register apply provided context from map parameter.
     */
    scope.INTERNAL.registerService = function <
      T extends TAnyObject,
      C extends TAnyObject,
      M extends IContextManagerConstructor<C, T>
    >(ManagerClass: M, initialState?: T | null, initialContext?: C) {
      return registerService(
        ManagerClass,
        initialState,
        appliedContexts.get(ManagerClass) as M["prototype"]["context"]
      );
    };
  }

  return scope;
}
