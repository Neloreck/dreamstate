import { createRegistry, IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { mockScope } from "@/dreamstate/test-utils/registry/mockScope";

describe("mockScope test util", () => {
  it("Should properly mock scope with clean state", () => {
    const scope: IScopeContext = mockScope();

    expect(scope).toBeInstanceOf(Object);
    expect(scope.INTERNAL).toBeDefined();

    expect(scope.unsubscribeFromSignals).toBeDefined();
    expect(scope.subscribeToSignals).toBeDefined();
    expect(scope.registerQueryProvider).toBeDefined();
    expect(scope.unRegisterQueryProvider).toBeDefined();
    expect(scope.emitSignal).toBeDefined();
    expect(scope.queryDataSync).toBeDefined();
    expect(scope.queryDataAsync).toBeDefined();
  });

  it("Should properly inject provided registry", () => {
    const registry: IRegistry = createRegistry();
    const scope: IScopeContext = mockScope(registry);

    expect(scope.INTERNAL.REGISTRY).toBe(registry);
  });
});
