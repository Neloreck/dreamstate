import { isFunction, isObject, isUndefined } from "@/dreamstate/utils/typechecking";

describe("typecheing utils functionality", () => {
  it("Should check object values correctly", () => {
    expect(isObject({})).toBeTruthy();
    expect(isObject({ a: 1 })).toBeTruthy();
    expect(isObject({ b: 6 })).toBeTruthy();
    expect(isObject(null)).toBeFalsy();
    expect(isObject(0)).toBeFalsy();
    expect(isObject(false)).toBeFalsy();
    expect(isObject(() => {})).toBeFalsy();
    expect(isObject(NaN)).toBeFalsy();
    expect(isObject(undefined)).toBeFalsy();
    expect(isObject(Infinity)).toBeFalsy();
    expect(isObject(Symbol("test"))).toBeFalsy();
  });

  it("Should check function values correctly", () => {
    expect(isFunction({})).toBeFalsy();
    expect(isFunction({ a: 1 })).toBeFalsy();
    expect(isFunction({ b: 6 })).toBeFalsy();
    expect(isFunction(null)).toBeFalsy();
    expect(isFunction(0)).toBeFalsy();
    expect(isFunction(false)).toBeFalsy();
    expect(isFunction(() => {})).toBeTruthy();
    expect(isFunction(new Function())).toBeTruthy();
    expect(isFunction(NaN)).toBeFalsy();
    expect(isFunction(undefined)).toBeFalsy();
    expect(isFunction(Infinity)).toBeFalsy();
    expect(isFunction(Symbol("test"))).toBeFalsy();
  });

  it("Should check undefined values correctly", () => {
    expect(isUndefined({})).toBeFalsy();
    expect(isUndefined({ a: 1 })).toBeFalsy();
    expect(isUndefined({ b: 6 })).toBeFalsy();
    expect(isUndefined(null)).toBeFalsy();
    expect(isUndefined(0)).toBeFalsy();
    expect(isUndefined(false)).toBeFalsy();
    expect(isUndefined(() => {})).toBeFalsy();
    expect(isUndefined(NaN)).toBeFalsy();
    expect(isUndefined(undefined)).toBeTruthy();
    expect(isUndefined("undefined")).toBeFalsy();
    expect(isUndefined(Infinity)).toBeFalsy();
    expect(isUndefined(Symbol)).toBeFalsy();
  });
});
