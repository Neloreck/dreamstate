import { initializeScopeContext } from "@/dreamstate/core/scoping/initializeScopeContext";
import { createRegistry, IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { IS_MOCKED } from "@/dreamstate/test-utils/internals";
import { TAnyContextManagerConstructor, TUpdateObserver } from "@/dreamstate/types";

/**
 * Mock scope with clean initial state.
 * Can be used to mock whole scope context and run some advanced tests.
 *
 * @param {boolean} isLifecycleDisabled - boolean flag telling whether should disable provision events, true by default.
 * @param {IRegistry} registry - optional custom registry that will be used as scope storage.
 * @returns {IScopeContext} mocked scope context.
 */
export function mockScope(isLifecycleDisabled: boolean = true, registry: IRegistry = createRegistry()): IScopeContext {
  const scope: IScopeContext = initializeScopeContext(registry);

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

    /**
     * Mark scope as mocked and exclude lifecycle methods.
     */
    Object.defineProperty(scope, IS_MOCKED, { value: true });
  }

  return scope;
}
