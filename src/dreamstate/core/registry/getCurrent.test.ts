import { getCurrent } from "@/dreamstate/core/registry/getCurrent";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { TestContextManager } from "@/fixtures";

describe("getCurrent method functionality", () => {
  it("Should properly return current service instance", () => {
    expect(getCurrent(TestContextManager)).toBeNull();

    const service: TestContextManager = registerService(TestContextManager);

    expect(getCurrent(TestContextManager)).toBe(service);

    unRegisterService(TestContextManager);

    expect(getCurrent(TestContextManager)).toBeNull();
  });
});
