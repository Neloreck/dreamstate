import { createRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { mockRegistry } from "@/dreamstate/test-utils/registry/mockRegistry";

describe("mockRegistry method", () => {
  it("should be same as registry creation method", () => {
    expect(mockRegistry()).toStrictEqual(createRegistry());
  });
});
