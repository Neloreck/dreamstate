import { initializeScopeContext } from "@/dreamstate/core/scoping/initializeScopeContext";
import { createRegistry, IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { IS_MOCKED } from "@/dreamstate/test-utils/internals";
import {
  IContextManagerConstructor,
  TAnyContextManagerConstructor,
  TAnyObject,
  TUpdateObserver,
} from "@/dreamstate/types";

export interface IMockScopeConfig {
  isLifecycleDisabled?: boolean;
  applyInitialContexts?: Array<[TAnyContextManagerConstructor, TAnyObject]>;
}

/**
 * Creates a mock scope with a clean initial state.
 * This can be used to mock the entire scope context for advanced testing.
 *
 * The `mockManagerInitialContext` function can be used to provision mocked contexts within this scope.
 *
 * @param {IMockScopeConfig} [mockConfig={}] - Configuration object for scope mocking.
 * @param {IRegistry} [registry=createRegistry()] - An optional custom registry to be used as the scope storage.
 * @returns {IScopeContext} A mocked scope context.
 */
export function mockScope(mockConfig: IMockScopeConfig = {}, registry: IRegistry = createRegistry()): IScopeContext {
  const { isLifecycleDisabled = true, applyInitialContexts = [] } = mockConfig;
  const appliedContexts: Map<TAnyContextManagerConstructor, TAnyObject> = new Map(applyInitialContexts);
  const scope: IScopeContext = initializeScopeContext(registry);

  /*
   * Mark scope as mocked.
   */
  Object.defineProperty(scope, IS_MOCKED, { value: true });

  /*
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

  /*
   * Mock post-register contexts.
   */
  if (appliedContexts.size) {
    const registerService = scope.INTERNAL.registerService;

    /*
     * On register apply provided context from map parameter.
     */
    scope.INTERNAL.registerService = function <
      T extends TAnyObject,
      C extends TAnyObject,
      M extends IContextManagerConstructor<C, T>,
    >(ManagerClass: M, initialState?: T | null, _?: C): boolean {
      return registerService(
        ManagerClass,
        initialState,
        appliedContexts.get(ManagerClass) as M["prototype"]["context"]
      );
    };
  }

  return scope;
}
