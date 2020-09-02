import { getCurrent } from "@/dreamstate/core/registry/getCurrent";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { createLoadable } from "@/dreamstate/utils/createLoadable";
import { createNested } from "@/dreamstate/utils/createNested";
import { createSetter } from "@/dreamstate/utils/createSetter";
import { NestedContextManager } from "@/fixtures";

describe("CreateSetter util", () => {
  beforeEach(() => {
    registerService(NestedContextManager);
  });

  afterEach(() => {
    unRegisterService(NestedContextManager);
  });

  it("Should properly declare create setters", () => {
    const nestedManager: NestedContextManager =
      getCurrent(NestedContextManager)!;

    const firstSetter = createSetter(nestedManager,"first");
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

  it("Should properly work with functional setters", () => {
    const nestedManager: NestedContextManager = getCurrent(NestedContextManager)!;
    const setter = createSetter(nestedManager, "second");

    const originalC: number = nestedManager.context.second.c;

    nestedManager.setContext = jest.fn(nestedManager.setContext.bind(nestedManager));

    setter(({ c }) => ({ c: c * 2 }));

    expect(nestedManager.context.second.c).toBe(originalC * 2);
    expect(nestedManager.setContext).toHaveBeenCalled();
  });

  it("Should not allow create setters for non-object values", () => {
    const mockManagerWithContext = {
      context: {
        loadable: createLoadable("example"),
        mutable: createNested({ example: true }),
        string: "string",
        number: 1
      }
    };

    type TContext = typeof mockManagerWithContext.context;

    expect(() => createSetter(mockManagerWithContext as ContextManager<TContext>, "loadable")).not.toThrow(Error);
    expect(() => createSetter(mockManagerWithContext as ContextManager<TContext>, "mutable")).not.toThrow(Error);

    expect(() => createSetter(mockManagerWithContext as ContextManager<TContext>, "string")).toThrow(TypeError);
    expect(() => createSetter(mockManagerWithContext as ContextManager<TContext>, "number")).toThrow(TypeError);
    expect(
      () => createSetter(mockManagerWithContext as ContextManager<TContext>, "undefined prop" as any)
    ).toThrow(TypeError);
  });
});
