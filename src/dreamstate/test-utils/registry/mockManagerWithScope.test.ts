import { mockManagerWithScope } from "@/dreamstate/test-utils/registry/mockManagerWithScope";
import { TestManager } from "@/fixtures";

describe("mockManagerWithScope test util", () => {
  it("Should properly mock manager with context", () => {
    const [ manager, scope ] = mockManagerWithScope(TestManager);

    expect(manager).toBeInstanceOf(TestManager);
    expect(manager.context.first).toBe("first");

    expect(scope).toBeInstanceOf(Object);
    expect(scope.INTERNAL).toBeInstanceOf(Object);
    expect(scope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.size).toBe(1);
  });
});
