import { mockManager } from "@/dreamstate/test-utils/registry/mockManager";
import { TestManager } from "@/fixtures";

describe("mockManager test util", () => {
  it("Should properly mock manager with context", () => {
    const manager: TestManager = mockManager(TestManager);

    expect(manager).toBeInstanceOf(TestManager);
    expect(manager.context.first).toBe("first");
  });
});
