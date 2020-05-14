import { getCurrentContext } from "@/dreamstate/core/registry/getCurrentContext";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { TestContextManager } from "@/fixtures";

describe("getCurrentContext method functionality.", () => {
  it("Should properly return current manager context.", () => {
    expect(getCurrentContext(TestContextManager)).toBeNull();

    const manager: TestContextManager = registerService(TestContextManager);

    expect(getCurrentContext(TestContextManager)).toBe(manager.context);

    unRegisterService(TestContextManager);

    expect(getCurrentContext(TestContextManager)).toBeNull();
  });
});
