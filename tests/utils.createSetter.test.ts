import { getCurrentManager } from "../src/registry";
import { createLoadable, createMutable, createSetter } from "../src/utils";

import { NestedContextManager } from "./assets";
import { registerManagerClass, unRegisterManagerClass } from "./helpers";

describe("CreateSetter util.", () => {
  beforeEach(() => {
    registerManagerClass(NestedContextManager);
  });

  afterEach(() => {
    unRegisterManagerClass(NestedContextManager);
  });

  it("Should properly declare create setters.", () => {
    const nestedManager: NestedContextManager = getCurrentManager(NestedContextManager)!;

    const firstSetter = createSetter(nestedManager, "first");
    const secondSetter = createSetter(nestedManager, "second");

    expect(nestedManager.context.first.a).toBe(1);
    expect(nestedManager.context.first.b).toBe(2);
    expect(nestedManager.context.second.c).toBe(3);
    expect(nestedManager.context.second.d).toBe(4);

    const initialSecond = nestedManager.context.second;

    nestedManager.setContext = jest.fn(nestedManager.setContext.bind(nestedManager));

    firstSetter({ a: 11 });

    expect(nestedManager.setContext).toHaveBeenCalled();
    expect(nestedManager.context.first.a).toBe(11);
    expect(nestedManager.context.first.b).toBe(2);
    expect(nestedManager.context.second).toBe(initialSecond);

    (nestedManager.setContext as jest.Mocked<any>).mockClear();

    firstSetter({ b: 22 });

    expect(nestedManager.setContext).toHaveBeenCalled();
    expect(nestedManager.context.first.a).toBe(11);
    expect(nestedManager.context.first.b).toBe(22);
    expect(nestedManager.context.second).toBe(initialSecond);

    (nestedManager.setContext as jest.Mocked<any>).mockClear();

    secondSetter({});

    expect(nestedManager.context.second).not.toBe(initialSecond);
    expect(nestedManager.context.second.c).toBe(3);
    expect(nestedManager.context.second.d).toBe(4);
    expect(nestedManager.setContext).toHaveBeenCalled();
  });

  it("Should properly work with functional setters.", () => {
    const nestedManager: NestedContextManager = getCurrentManager(NestedContextManager)!;
    const setter = createSetter(nestedManager, "second");

    const originalC: number = nestedManager.context.second.c;

    nestedManager.setContext = jest.fn(nestedManager.setContext.bind(nestedManager));

    setter(({ c }) => ({ c: c * 2 }));

    expect(nestedManager.context.second.c).toBe(originalC * 2);
    expect(nestedManager.setContext).toHaveBeenCalled();
  });

  it("Should not allow create setters for non-object values.", () => {
    const mockManagerWithContext = {
      context: {
        loadable: createLoadable("example"),
        mutable: createMutable({ example: true }),
        string: "string",
        number: 1
      }
    };

    expect(() => createSetter(mockManagerWithContext as any, "loadable")).not.toThrow(Error);
    expect(() => createSetter(mockManagerWithContext as any, "mutable")).not.toThrow(Error);

    expect(() => createSetter(mockManagerWithContext as any, "string")).toThrow(TypeError);
    expect(() => createSetter(mockManagerWithContext as any, "number")).toThrow(TypeError);
    expect(() => createSetter(mockManagerWithContext as any, "undefined prop")).toThrow(TypeError);
  });
});
