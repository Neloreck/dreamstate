import { getCurrent } from "./getCurrent";
import { registerService, unRegisterService } from "../test-utils";

import { TestContextService } from "@Tests/assets";

describe("getCurrent method functionality.", () => {
  it("Should properly return current service instance.", () => {
    expect(getCurrent(TestContextService)).toBeNull();

    const service: TestContextService = registerService(TestContextService);

    expect(getCurrent(TestContextService)).toBe(service);

    unRegisterService(TestContextService);

    expect(getCurrent(TestContextService)).toBeNull();
  });
});
