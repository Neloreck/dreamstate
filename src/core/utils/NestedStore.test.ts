import { shouldObserversUpdate } from "@Lib/core/observing/shouldObserversUpdate";
import { NestedStore } from "@Lib/core/utils/NestedStore";

describe("Nested store class", () => {
  it("Should be shallow-checked by core and update if objects are different.", () => {
    const firstLoadableInlineObj = { nested: Object.assign(new NestedStore(), { a: 1 }) };
    const secondLoadableInlineObj = { nested: Object.assign(new NestedStore(), { b: 2 }) };

    expect(shouldObserversUpdate(firstLoadableInlineObj, secondLoadableInlineObj)).toBeTruthy();
  });

  it("Should be shallow-checked by core and not update if objects are same.", () => {
    const firstLoadableInlineObj = { nested: Object.assign(new NestedStore(), { a: 1 }) };
    const secondLoadableInlineObj = { nested: Object.assign(new NestedStore(), { a: 1 }) };

    expect(shouldObserversUpdate(firstLoadableInlineObj, secondLoadableInlineObj)).toBeFalsy();
  });
});
