import { Consume } from "@Lib/core/consumption/Consume";
import { withConsumption } from "@Lib/core/consumption/withConsumption";

describe("withConsumption HoC.", () => {
  it("Hoc alias should be same as decorator.", () => {
    expect(Consume).toBe(withConsumption);
  });
});
