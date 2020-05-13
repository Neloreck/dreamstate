import { getCurrentContext } from "./getCurrentContext";
import { registerService, unRegisterService } from "../test-utils";

import { TestContextManager } from "@Tests/../fixtures";

describe("getCurrentContext method functionality.", () => {
  it("Should properly return current manager context.", () => {
    expect(getCurrentContext(TestContextManager)).toBeNull();

    const manager: TestContextManager = registerService(TestContextManager);

    expect(getCurrentContext(TestContextManager)).toBe(manager.context);

    unRegisterService(TestContextManager);

    expect(getCurrentContext(TestContextManager)).toBeNull();
  });
});
