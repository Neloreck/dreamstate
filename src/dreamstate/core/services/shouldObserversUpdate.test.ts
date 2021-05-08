import { shouldObserversUpdate } from "@/dreamstate/core/services/shouldObserversUpdate";
import { TAnyObject } from "@/dreamstate/types";

describe("shouldObserversUpdate method functionality", () => {
  it("Should return true of previous context does not exist", () => {
    const previous: TAnyObject = null as any;
    const next: TAnyObject = { a: 15, b: 50 };

    expect(shouldObserversUpdate(previous, next)).toBeTruthy();
  });

  it("Should fail if next context is invalid", () => {
    const previous: TAnyObject = { a: 50 };

    expect(() => shouldObserversUpdate(previous, null as any)).toThrow(TypeError);
    expect(() => shouldObserversUpdate(previous, 1 as any)).toThrow(TypeError);
    expect(() => shouldObserversUpdate(previous, false as any)).toThrow(TypeError);
    expect(() => shouldObserversUpdate(previous, NaN as any)).toThrow(TypeError);
    expect(() => shouldObserversUpdate(previous, undefined as any)).toThrow(TypeError);
  });

  it("Should check properly same nested primitives and objects", () => {
    const first: TAnyObject = { first: 1 };
    const firstDifferent: TAnyObject = { first: 1 };
    const second: TAnyObject = { second: 2 };

    expect(shouldObserversUpdate(first, firstDifferent)).toBeFalsy();
    expect(shouldObserversUpdate(first, second)).toBeTruthy();
    expect(shouldObserversUpdate(firstDifferent, second)).toBeTruthy();

    const firstNested = { first };
    const firstSameNested = { first };
    const firstDifferentNested = { first: firstDifferent };

    expect(shouldObserversUpdate(firstNested, firstSameNested)).toBeFalsy();
    expect(shouldObserversUpdate(firstNested, firstDifferentNested)).toBeTruthy();

    const firstString: TAnyObject = { first: "first" };
    const firstStringDifferent: TAnyObject = { first: "first" };
    const secondString: TAnyObject = { second: "second" };

    expect(shouldObserversUpdate(firstString, firstStringDifferent)).toBeFalsy();
    expect(shouldObserversUpdate(firstString, secondString)).toBeTruthy();
    expect(shouldObserversUpdate(firstStringDifferent, secondString)).toBeTruthy();
  });

  it("Should properly check only refs for plain objects and primitives", () => {
    let base = {
      nested: {
        a: 1,
        b: 2,
        c: 3
      }
    };
    let next = { nested: { ...base.nested } };

    expect(shouldObserversUpdate(base, next)).toBeTruthy();

    base = { nested: { ...base.nested } };
    next = { ...base };

    next.nested.a = 5;
    next.nested.b = 5;

    expect(shouldObserversUpdate(base, next)).toBeFalsy();
  });
});
