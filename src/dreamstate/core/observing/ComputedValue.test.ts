import { ComputedValue } from "@/dreamstate/core/observing/ComputedValue";
import { shouldObserversUpdate } from "@/dreamstate/core/observing/shouldObserversUpdate";

describe("Computed value class", () => {
  it("Should not be checked when comparing values before manager update", () => {
    const firstComputedValue = { nested: Object.assign(new ComputedValue(), { a: 1 }) };
    const secondComputedValue = { nested: Object.assign(new ComputedValue(), { b: 2 }) };

    expect(shouldObserversUpdate(firstComputedValue, secondComputedValue)).toBeFalsy();
  });
});
