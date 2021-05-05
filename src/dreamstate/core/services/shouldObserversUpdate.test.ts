import { shouldObserversUpdate } from "@/dreamstate/core/services/shouldObserversUpdate";
import { TAnyObject } from "@/dreamstate/types";

describe("shouldObserversUpdate method functionality", () => {
  it("Should return true of previous context does not exist", () => {
    const previous: null = null;
    const next: TAnyObject = { a: 15, b: 50 };

    expect(shouldObserversUpdate(previous as any, next)).toBeTruthy();
  });

  it("Should check properly same nested primitives and objects", () => {
    const first = { first: 1 };
    const firstDifferent = { first: 1 };
    const second = { second: 2 };

    expect(shouldObserversUpdate(first, firstDifferent)).toBeFalsy();
    expect(shouldObserversUpdate(first, second)).toBeTruthy();
    expect(shouldObserversUpdate(firstDifferent, second)).toBeTruthy();

    const firstNested = { first };
    const firstSameNested = { first };
    const firstDifferentNested = { first: firstDifferent };

    expect(shouldObserversUpdate(firstNested, firstSameNested)).toBeFalsy();
    expect(shouldObserversUpdate(firstNested, firstDifferentNested)).toBeTruthy();

    const firstString = { first: "first" };
    const firstStringDifferent = { first: "first" };
    const secondString = { second: "second" };

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
