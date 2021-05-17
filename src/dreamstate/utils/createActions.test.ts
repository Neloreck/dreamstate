import { createActions } from "@/dreamstate/utils/createActions";

describe("createActions method functionality", () => {
  it("Should create value with correct initial param", () => {
    const context = {
      a: createActions({
        first: (num: number) => num,
        second: () => false
      }),
      b: createActions({
        first: (str: string) => str
      })
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

  it("Should validate provided params object", () => {
    expect(() => createActions("" as any)).toThrow(TypeError);
    expect(() => createActions(null as any)).toThrow(TypeError);
    expect(() => createActions(undefined as any)).toThrow(TypeError);
    expect(() => createActions(false as any)).toThrow(TypeError);
    expect(() => createActions(0 as any)).toThrow(TypeError);
    expect(() => createActions(() => 0)).toThrow(TypeError);
    expect(() => createActions({})).not.toThrow(TypeError);
  });
});
