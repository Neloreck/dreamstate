import { getCurrentContext } from "@Lib/registry/getCurrentContext";
import { registerService } from "@Lib/testing/registerService";
import { unRegisterService } from "@Lib/testing/unRegisterService";
import { TestContextManager } from "@Lib/fixtures";

describe("getCurrentContext method functionality.", () => {
  it("Should properly return current manager context.", () => {
    expect(getCurrentContext(TestContextManager)).toBeNull();

    const manager: TestContextManager = registerService(TestContextManager);

    expect(getCurrentContext(TestContextManager)).toBe(manager.context);

    unRegisterService(TestContextManager);

    expect(getCurrentContext(TestContextManager)).toBeNull();
  });
});
