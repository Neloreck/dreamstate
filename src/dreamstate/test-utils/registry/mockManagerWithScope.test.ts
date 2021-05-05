import { mockManagerWithScope } from "@/dreamstate/test-utils/registry/mockManagerWithScope";
import { TestContextManager } from "@/fixtures";

describe("mockManager test util", () => {
  it("Should properly mock manager with context", () => {
    const [ manager, scope ] = mockManagerWithScope(TestContextManager);

    expect(manager).toBeInstanceOf(TestContextManager);
    expect(scope).toBeInstanceOf(Object);
    expect(manager.context.first).toBe("first");
    expect(scope.REGISTRY.CONTEXT_SERVICES_REGISTRY.size).toBe(1);
    expect(scope.REGISTRY.CONTEXT_SERVICES_ACTIVATED.size).toBe(1);
  });
});
