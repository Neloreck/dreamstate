import { getCurrentContext } from "@Lib/core/registry/getCurrentContext";
import { TestContextManager } from "@Lib/fixtures";
import { registerService } from "@Lib/test-utils/registry/registerService";
import { unRegisterService } from "@Lib/test-utils/registry/unRegisterService";

describe("getCurrentContext method functionality.", () => {
  it("Should properly return current manager context.", () => {
    expect(getCurrentContext(TestContextManager)).toBeNull();

    const manager: TestContextManager = registerService(TestContextManager);

    expect(getCurrentContext(TestContextManager)).toBe(manager.context);

    unRegisterService(TestContextManager);

    expect(getCurrentContext(TestContextManager)).toBeNull();
  });
});
