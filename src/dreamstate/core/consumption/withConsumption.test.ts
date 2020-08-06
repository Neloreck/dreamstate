import { Consume } from "@/dreamstate/core/consumption/Consume";
import { withConsumption } from "@/dreamstate/core/consumption/withConsumption";

describe("withConsumption HoC.", () => {
  it("Hoc alias should be same as decorator.", () => {
    expect(Consume).toBe(withConsumption);
  });
});
