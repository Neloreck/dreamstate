import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { mockScope } from "@/dreamstate/test-utils/registry/mockScope";
import { mockManager } from "@/dreamstate/test-utils/services/mockManager";
import { TestManager } from "@/fixtures";

describe("mockManager test util", () => {
  it("Should properly mock manager with context", () => {
    const manager: TestManager = mockManager(TestManager);

    expect(manager).toBeInstanceOf(TestManager);
    expect(manager.context.first).toBe("first");
  });

  it("Should properly inject manager in provided scope in case of supplied parameter", () => {
    const scope: IScopeContext = mockScope();

    expect(scope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.size).toBe(0);
    expect(scope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY.size).toBe(0);

    const manager: TestManager = mockManager(TestManager, undefined, scope);

    expect(scope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.size).toBe(1);
    expect(scope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY.size).toBe(1);
    expect(scope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.has(TestManager)).toBeTruthy();
    expect(scope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(TestManager)).toBe(manager);
  });
});
