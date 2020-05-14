import { getCurrent } from "@Lib/core/registry/getCurrent";
import { TestContextService } from "@Lib/fixtures";
import { registerService } from "@Lib/test-utils/registry/registerService";
import { unRegisterService } from "@Lib/test-utils/registry/unRegisterService";

describe("getCurrent method functionality.", () => {
  it("Should properly return current service instance.", () => {
    expect(getCurrent(TestContextService)).toBeNull();

    const service: TestContextService = registerService(TestContextService);

    expect(getCurrent(TestContextService)).toBe(service);

    unRegisterService(TestContextService);

    expect(getCurrent(TestContextService)).toBeNull();
  });
});
