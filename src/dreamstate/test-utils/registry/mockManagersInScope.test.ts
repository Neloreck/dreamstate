import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { getCurrent } from "@/dreamstate/test-utils/registry/getCurrent";
import { mockManagersInScope } from "@/dreamstate/test-utils/registry/mockManagersInScope";
import { ExtendingManager, TestManager } from "@/fixtures";

describe("mockManagersWithScope test util", () => {
  it("Should properly mock manager with context", () => {
    const scope: IScopeContext = mockManagersInScope([ TestManager ]);

    expect(getCurrent(TestManager, scope)).toBeInstanceOf(TestManager);
    expect(getCurrent(ExtendingManager, scope)).toBeNull();

    expect(scope).toBeInstanceOf(Object);
    expect(scope.INTERNAL).toBeInstanceOf(Object);
    expect(scope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.size).toBe(1);
  });
});
