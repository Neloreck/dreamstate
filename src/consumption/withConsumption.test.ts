import { Consume, withConsumption } from "./index";

describe("withConsumption HoC.", () => {
  it("Hoc alias should be same as decorator.", () => {
    expect(Consume).toBe(withConsumption);
  });
});
