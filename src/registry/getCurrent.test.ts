import { getCurrent } from "@Lib/registry/getCurrent";
import { registerService } from "@Lib/testing/registerService";
import { unRegisterService } from "@Lib/testing/unRegisterService";
import { TestContextService } from "@Lib/fixtures";

describe("getCurrent method functionality.", () => {
  it("Should properly return current service instance.", () => {
    expect(getCurrent(TestContextService)).toBeNull();

    const service: TestContextService = registerService(TestContextService);

    expect(getCurrent(TestContextService)).toBe(service);

    unRegisterService(TestContextService);

    expect(getCurrent(TestContextService)).toBeNull();
  });
});
