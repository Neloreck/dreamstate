import { Consume } from "@Lib/consumption/Consume";
import { withConsumption } from "@Lib/consumption/withConsumption";

describe("withConsumption HoC.", () => {
  it("Hoc alias should be same as decorator.", () => {
    expect(Consume).toBe(withConsumption);
  });
});
