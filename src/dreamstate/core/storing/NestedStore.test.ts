import { shouldObserversUpdate } from "@/dreamstate/core/services/shouldObserversUpdate";
import { NestedStore } from "@/dreamstate/core/storing/NestedStore";

describe("Nested store class", () => {
  it("Should be shallow-checked by core and update if objects are different", () => {
    const firstLoadableInlineObj = { nested: Object.assign(new NestedStore(), { a: 1 }) as NestedStore };
    const secondLoadableInlineObj = { nested: Object.assign(new NestedStore(), { b: 2 }) as NestedStore };

    expect(shouldObserversUpdate(firstLoadableInlineObj, secondLoadableInlineObj)).toBeTruthy();
  });

  it("Should be shallow-checked by core and not update if objects are same", () => {
    const firstLoadableInlineObj = { nested: Object.assign(new NestedStore(), { a: 1 }) as NestedStore };
    const secondLoadableInlineObj = { nested: Object.assign(new NestedStore(), { a: 1 }) as NestedStore };

    expect(shouldObserversUpdate(firstLoadableInlineObj, secondLoadableInlineObj)).toBeFalsy();
  });
});
