import { createManagersObserver, shouldObserversUpdate } from "@Lib/observing";
import { createLoadable, createMutable } from "@Lib/utils";
import { TestContextWorker, TestContextManager } from "@Tests/assets";

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

  it("Should create observers for context workers only.", () => {
    expect(() => createManagersObserver(null, undefined as any)).toThrow();
    expect(() => createManagersObserver(null, [ 1 as any ])).toThrow();
    expect(() => createManagersObserver(null, [ {} as any ])).toThrow();
    expect(() => createManagersObserver(null, [ null as any ])).toThrow();
    expect(() => createManagersObserver(null, [ "123" as any ])).toThrow();
    expect(() => createManagersObserver(null, [ true as any ])).toThrow();

    expect(() => createManagersObserver(null, [])).not.toThrow();
    expect(() => createManagersObserver(null, [ TestContextManager ])).not.toThrow();
    expect(() => createManagersObserver(null, [ TestContextWorker ])).not.toThrow();
  });
});
