import { getCurrent } from "./getCurrent";
import { registerWorker, unRegisterWorker } from "../test-utils";

import { TestContextWorker } from "@Tests/assets";

describe("getCurrent method functionality.", () => {
  it("Should properly return current worker instance.", () => {
    expect(getCurrent(TestContextWorker)).toBeNull();

    const worker: TestContextWorker = registerWorker(TestContextWorker);

    expect(getCurrent(TestContextWorker)).toBe(worker);

    unRegisterWorker(TestContextWorker);

    expect(getCurrent(TestContextWorker)).toBeNull();
  });
});
