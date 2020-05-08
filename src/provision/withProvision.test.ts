import { withProvision } from "./withProvision";
import { Provide } from "./Provide";

describe("withProvision HoC method.", () => {
  it("Should be same as @Provide decorator", () => {
    expect(withProvision).toBe(Provide);
  });
});
