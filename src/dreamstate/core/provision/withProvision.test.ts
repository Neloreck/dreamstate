import { Provide } from "@/dreamstate/core/provision/Provide";
import { withProvision } from "@/dreamstate/core/provision/withProvision";

describe("withProvision HoC method.", () => {
  it("Should be same as @Provide decorator", () => {
    expect(withProvision).toBe(Provide);
  });
});
