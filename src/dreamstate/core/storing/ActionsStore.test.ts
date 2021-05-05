import { shouldObserversUpdate } from "@/dreamstate/core/services/shouldObserversUpdate";
import { ActionsStore } from "@/dreamstate/core/storing/ActionsStore";

describe("ActionsStore value class", () => {
  it("Should not be checked when comparing values before manager update", () => {
    const firstActionsStore = { nested: Object.assign(new ActionsStore(), { a: () => {} }) };
    const secondActionsStore = { nested: Object.assign(new ActionsStore(), { a: () => {} }) };
    const thirdActionsStore = { nested: Object.assign(new ActionsStore(), { c: () => {} }) };

    expect(shouldObserversUpdate(firstActionsStore, secondActionsStore)).toBeFalsy();
    expect(shouldObserversUpdate(firstActionsStore, thirdActionsStore)).toBeFalsy();
    expect(shouldObserversUpdate(secondActionsStore, thirdActionsStore)).toBeFalsy();
  });
});
