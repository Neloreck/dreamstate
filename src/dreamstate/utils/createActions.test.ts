import { DreamstateError } from "@/dreamstate";
import { EDreamstateErrorCode, TAnyValue } from "@/dreamstate/types";
import { createActions } from "@/dreamstate/utils/createActions";
import { getCallableError } from "@/fixtures";

describe("createActions method functionality", () => {
  it("should create value with correct initial param", () => {
    const context = {
      a: createActions({
        first: (num: number) => num,
        second: () => false,
      }),
      b: createActions({
        first: (str: string) => str,
      }),
    };

    expect(Object.keys(context)).toHaveLength(2);
    expect(Object.keys(context.a)).toHaveLength(2);
    expect(Object.keys(context.b)).toHaveLength(1);

    expect(context.a).toBeDefined();
    expect(context.a.first).toBeDefined();
    expect(context.a.second).toBeDefined();
    expect(context.a.first(5)).toBe(5);
    expect(context.a.second()).toBeFalsy();
    expect(context.b.first("a")).toBe("a");
  });

  it("should validate provided params object", () => {
    expect(() => createActions("" as TAnyValue)).toThrow(DreamstateError);
    expect(() => createActions(null as TAnyValue)).toThrow(DreamstateError);
    expect(() => createActions(undefined as TAnyValue)).toThrow(DreamstateError);
    expect(() => createActions(false as TAnyValue)).toThrow(DreamstateError);
    expect(() => createActions(0 as TAnyValue)).toThrow(DreamstateError);
    expect(() => createActions(() => 0)).toThrow(DreamstateError);
    expect(() => createActions({})).not.toThrow();
    expect(getCallableError<DreamstateError>(() => createActions(false as TAnyValue)).code).toBe(
      EDreamstateErrorCode.INCORRECT_PARAMETER
    );
  });
});
