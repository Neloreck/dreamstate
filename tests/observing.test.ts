import { shouldObserversUpdate } from "../src/observing";
import { createLoadable, createMutable } from "../src/utils";

describe("Observing utils and methods.", () => {
  it("Should notifiers update must check properly same nested primitives and objects.", () => {
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

  it("Should properly check only refs for plain objects and primitives.", () => {
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

  it("Should run shallow check for createMutable objects.", () => {
    let base = {
      nested: createMutable({
        a: 1,
        b: 2,
        c: 3
      })
    };
    let next = { nested: base.nested.asMerged({}) };

    expect(shouldObserversUpdate(base, next)).toBeFalsy();

    base = { nested: base.nested };
    next = { nested: base.nested };

    next.nested.a = 5;
    next.nested.b = 5;

    expect(shouldObserversUpdate(base, next)).toBeFalsy();

    base = { nested: createMutable({ a: 1, b: 2, c: 3 }) };
    next = { nested: base.nested };

    expect(shouldObserversUpdate(base, next)).toBeFalsy();

    next.nested = next.nested.asMerged({ a: 1, b: 2, c: 3 });

    expect(shouldObserversUpdate(base, next)).toBeFalsy();

    next.nested = next.nested.asMerged({ a: 2 });

    expect(shouldObserversUpdate(base, next)).toBeTruthy();
  });

  it("Should properly compare initial SUBSTORE objects.", () => {
    const firstMutable = { nested: createMutable({ a: 1, b: 2 }) };
    const secondMutable = { nested: createMutable({ a: 1, b: 2 }) };

    expect(shouldObserversUpdate(firstMutable, secondMutable)).toBeFalsy();

    const firstLoadable = { nested: createLoadable("test") };
    const secondLoadable = { nested: createLoadable("test") };

    expect(shouldObserversUpdate(firstLoadable, secondLoadable)).toBeFalsy();
  });

  it("Should properly compare mutables with same stored value.", () => {
    const firstLoadableInlineObj = { nested: createLoadable({ a: 1 }) };
    const secondLoadableInlineObj = { nested: createLoadable({ a: 1 }) };

    expect(shouldObserversUpdate(firstLoadableInlineObj, secondLoadableInlineObj)).toBeTruthy();

    const obj: object = { a: 15 };

    const firstLoadableObj = { nested: createLoadable(obj) };
    const secondLoadableObj = { nested: createLoadable(obj) };

    expect(shouldObserversUpdate(firstLoadableObj, secondLoadableObj)).toBeFalsy();
  });
});
