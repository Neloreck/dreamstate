import { getCurrentContext } from "./getCurrentContext";
import { registerWorker, unRegisterWorker } from "../test-utils";

import { TestContextManager } from "@Tests/assets";

describe("getCurrentContext method functionality.", () => {
  it("Should properly return current manager context.", () => {
    expect(getCurrentContext(TestContextManager)).toBeNull();

    const manager: TestContextManager = registerWorker(TestContextManager);

    expect(getCurrentContext(TestContextManager)).toBe(manager.context);

    unRegisterWorker(TestContextManager);

    expect(getCurrentContext(TestContextManager)).toBeNull();
  });
});
