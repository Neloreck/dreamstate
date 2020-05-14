import { Provide } from "@Lib/core/provision/Provide";
import { withProvision } from "@Lib/core/provision/withProvision";

describe("withProvision HoC method.", () => {
  it("Should be same as @Provide decorator", () => {
    expect(withProvision).toBe(Provide);
  });
});
