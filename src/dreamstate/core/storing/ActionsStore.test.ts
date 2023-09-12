import { shouldObserversUpdate } from "@/dreamstate/core/services/shouldObserversUpdate";
import { ActionsStore } from "@/dreamstate/core/storing/ActionsStore";

describe("ActionsStore value class", () => {
  it("should not be checked when comparing values before manager update", () => {
    const firstActionsStore = { nested: new ActionsStore({ a: () => {} }) };
    const secondActionsStore = { nested: new ActionsStore({ a: () => {} }) };
    const thirdActionsStore = { nested: new ActionsStore({ c: () => {} }) };

    expect(shouldObserversUpdate(firstActionsStore, secondActionsStore)).toBeFalsy();
    expect(shouldObserversUpdate(firstActionsStore, thirdActionsStore)).toBeFalsy();
    expect(shouldObserversUpdate(secondActionsStore, thirdActionsStore)).toBeFalsy();
  });
});
