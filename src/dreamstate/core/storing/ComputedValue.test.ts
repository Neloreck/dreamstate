import { shouldObserversUpdate } from "@/dreamstate/core/services/shouldObserversUpdate";
import { ComputedValue } from "@/dreamstate/core/storing/ComputedValue";

describe("Computed value class", () => {
  it("Should not be checked when comparing values before manager update", () => {
    const firstComputedValue = { nested: Object.assign(new ComputedValue(), { a: 1 }) };
    const secondComputedValue = { nested: Object.assign(new ComputedValue(), { b: 2 }) };

    expect(shouldObserversUpdate(firstComputedValue, secondComputedValue)).toBeFalsy();
  });
});
