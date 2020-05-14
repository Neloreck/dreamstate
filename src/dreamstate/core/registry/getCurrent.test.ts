import { getCurrent } from "@/dreamstate/core/registry/getCurrent";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { TestContextService } from "@/fixtures";

describe("getCurrent method functionality.", () => {
  it("Should properly return current service instance.", () => {
    expect(getCurrent(TestContextService)).toBeNull();

    const service: TestContextService = registerService(TestContextService);

    expect(getCurrent(TestContextService)).toBe(service);

    unRegisterService(TestContextService);

    expect(getCurrent(TestContextService)).toBeNull();
  });
});
