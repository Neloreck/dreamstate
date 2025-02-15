import {
  isCorrectQueryType,
  isCorrectSignalType,
  isFunction,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from "@/dreamstate/utils/typechecking";

describe("typecheing utils functionality", () => {
  it("should check object values correctly", () => {
    expect(isObject({})).toBeTruthy();
    expect(isObject({ a: 1 })).toBeTruthy();
    expect(isObject({ b: 6 })).toBeTruthy();
    expect(isObject(null)).toBeFalsy();
    expect(isObject("")).toBeFalsy();
    expect(isObject("1234")).toBeFalsy();
    expect(isObject(0)).toBeFalsy();
    expect(isObject(false)).toBeFalsy();
    expect(isObject(() => {})).toBeFalsy();
    expect(isObject(NaN)).toBeFalsy();
    expect(isObject(undefined)).toBeFalsy();
    expect(isObject(Infinity)).toBeFalsy();
    expect(isObject(Symbol("test"))).toBeFalsy();
  });

  it("should check string values correctly", () => {
    expect(isString({})).toBeFalsy();
    expect(isString({ a: 1 })).toBeFalsy();
    expect(isString({ b: 6 })).toBeFalsy();
    expect(isString(null)).toBeFalsy();
    expect(isString("")).toBeTruthy();
    expect(isString("1234")).toBeTruthy();
    expect(isString(0)).toBeFalsy();
    expect(isString(false)).toBeFalsy();
    expect(isString(() => {})).toBeFalsy();
    expect(isString(NaN)).toBeFalsy();
    expect(isString(undefined)).toBeFalsy();
    expect(isString(Infinity)).toBeFalsy();
    expect(isString(Symbol("test"))).toBeFalsy();
  });

  it("should check number primitive values correctly", () => {
    expect(isNumber({})).toBeFalsy();
    expect(isNumber({ a: 1 })).toBeFalsy();
    expect(isNumber({ b: 6 })).toBeFalsy();
    expect(isNumber(null)).toBeFalsy();
    expect(isNumber("")).toBeFalsy();
    expect(isNumber("1234")).toBeFalsy();
    expect(isNumber(0)).toBeTruthy();
    expect(isNumber(1)).toBeTruthy();
    expect(isNumber(1e100)).toBeTruthy();
    expect(isNumber(-100_000)).toBeTruthy();
    expect(isNumber(false)).toBeFalsy();
    expect(isNumber(() => {})).toBeFalsy();
    expect(isNumber(NaN)).toBeTruthy();
    expect(isNumber(undefined)).toBeFalsy();
    expect(isNumber(Infinity)).toBeTruthy();
    expect(isNumber(Symbol("test"))).toBeFalsy();
  });

  it("should check function values correctly", () => {
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

  it("should check undefined values correctly", () => {
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

  it("should correctly verify signal types", () => {
    expect(isCorrectQueryType({})).toBeFalsy();
    expect(isCorrectQueryType({ a: 1 })).toBeFalsy();
    expect(isCorrectQueryType({ b: 6 })).toBeFalsy();
    expect(isCorrectQueryType(null)).toBeFalsy();
    expect(isCorrectQueryType("")).toBeTruthy();
    expect(isCorrectQueryType("1234")).toBeTruthy();
    expect(isCorrectQueryType(0)).toBeTruthy();
    expect(isCorrectQueryType(false)).toBeFalsy();
    expect(isCorrectQueryType(() => {})).toBeFalsy();
    expect(isCorrectQueryType(NaN)).toBeTruthy();
    expect(isCorrectQueryType(undefined)).toBeFalsy();
    expect(isCorrectQueryType(Infinity)).toBeTruthy();
    expect(isCorrectQueryType(Symbol("test"))).toBeTruthy();
  });

  it("should correctly verify signal types", () => {
    expect(isCorrectSignalType({})).toBeFalsy();
    expect(isCorrectSignalType({ a: 1 })).toBeFalsy();
    expect(isCorrectSignalType({ b: 6 })).toBeFalsy();
    expect(isCorrectSignalType(null)).toBeFalsy();
    expect(isCorrectSignalType("")).toBeTruthy();
    expect(isCorrectSignalType("1234")).toBeTruthy();
    expect(isCorrectSignalType(0)).toBeTruthy();
    expect(isCorrectSignalType(false)).toBeFalsy();
    expect(isCorrectSignalType(() => {})).toBeFalsy();
    expect(isCorrectSignalType(NaN)).toBeTruthy();
    expect(isCorrectSignalType(undefined)).toBeFalsy();
    expect(isCorrectSignalType(Infinity)).toBeTruthy();
    expect(isCorrectSignalType(Symbol("test"))).toBeTruthy();
  });
});
