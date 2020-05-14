import { withProvision } from "@Lib/provision/withProvision";
import { Provide } from "@Lib/provision/Provide";

describe("withProvision HoC method.", () => {
  it("Should be same as @Provide decorator", () => {
    expect(withProvision).toBe(Provide);
  });
});
