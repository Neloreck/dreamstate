import { createRegistry, IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { mockManagerInitialContext } from "@/dreamstate/test-utils/registry/mockManagerInitialContext";
import { mockScope } from "@/dreamstate/test-utils/registry/mockScope";
import { TestManager } from "@/fixtures";

describe("mockScope test util", () => {
  it("should properly mock scope with clean state", () => {
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

  it("should properly inject provided registry", () => {
    const registry: IRegistry = createRegistry();
    const scope: IScopeContext = mockScope({ isLifecycleDisabled: true }, registry);

    expect(scope.INTERNAL.REGISTRY).toBe(registry);
  });

  it("should use registering with initial context", () => {
    const scope: IScopeContext = mockScope({
      isLifecycleDisabled: true,
      applyInitialContexts: [mockManagerInitialContext(TestManager, { first: "some-secret-param" })],
    });

    scope.INTERNAL.registerService(TestManager, {});

    expect(scope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY.get(TestManager)).toStrictEqual({
      first: "some-secret-param",
      second: 2,
      third: false,
    });
  });
});
