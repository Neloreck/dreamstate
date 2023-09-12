import { ContextManager, DreamstateError } from "@/dreamstate";
import { processComputed } from "@/dreamstate/core/storing/processComputed";
import { mockManager } from "@/dreamstate/test-utils";
import { EDreamstateErrorCode, TComputed } from "@/dreamstate/types";
import { createComputed } from "@/dreamstate/utils/createComputed";
import { getCallableError } from "@/fixtures";

describe("createComputed method functionality", () => {
  it("should create value with correct initial param", () => {
    const context = {
      first: createComputed(() => ({ nullValue: null })),
      second: createComputed(() => ({ test: 355 })),
      third: createComputed(
        () => ({ another: false }),
        () => []
      )
    };

    expect(context.first.nullValue).toBeUndefined();
    expect(context.first.__memo__).toBeUndefined();
    expect(context.first.__diff__).toBeUndefined();
    expect(context.first.__selector__).toBeDefined();

    expect(context.second.test).toBeUndefined();
    expect(context.second.__memo__).toBeUndefined();
    expect(context.second.__diff__).toBeUndefined();
    expect(context.second.__selector__).toBeDefined();

    expect(context.third.another).toBeUndefined();
    expect(context.third.__memo__).toBeDefined();
    expect(context.third.__diff__).toBeUndefined();
    expect(context.third.__selector__).toBeDefined();

    processComputed(context);

    expect(context.first.nullValue).toBeNull();
    expect(context.first.__memo__).toBeUndefined();
    expect(context.first.__diff__).toBeUndefined();
    expect(context.first.__selector__).toBeDefined();

    expect(context.second.test).toBe(355);
    expect(context.second.__memo__).toBeUndefined();
    expect(context.second.__diff__).toBeUndefined();
    expect(context.second.__selector__).toBeDefined();

    expect(context.third.another).toBe(false);
    expect(context.third.__memo__).toBeDefined();
    expect(context.third.__diff__).toBeDefined();
    expect(context.third.__selector__).toBeDefined();
  });

  it("should correctly work with context managers", () => {
    interface IComputedContext {
      example: TComputed<{
        multipliedByTwo: number;
        multipliedByThree: number;
      }>;
      testValue: number;
    }

    class ComputedManager extends ContextManager<IComputedContext> {

      public context: IComputedContext = {
        example: createComputed((context: IComputedContext) => ({
          multipliedByThree: context.testValue * 3,
          multipliedByTwo: context.testValue * 2
        })),
        testValue: 25
      };

    }

    const manager: ComputedManager = mockManager(ComputedManager);

    expect(manager.context.testValue).toBe(25);
    expect(manager.context.example.multipliedByTwo).toBe(50);
    expect(manager.context.example.multipliedByThree).toBe(75);

    manager.setContext({ testValue: 1000 });

    expect(manager.context.testValue).toBe(1000);
    expect(manager.context.example.multipliedByTwo).toBe(2000);
    expect(manager.context.example.multipliedByThree).toBe(3000);
  });

  it("should correctly compute non-primitive values", () => {
    interface IComputedContext {
      computed: TComputed<{
        greaterThanFive: Array<number>;
      }>;
      numbers: Array<number>;
    }

    class ComputedManager extends ContextManager<IComputedContext> {

      public context: IComputedContext = {
        computed: createComputed((context: IComputedContext) => ({
          greaterThanFive: context.numbers.filter((it: number) => it > 5)
        })),
        numbers: [ 0, 2, 4, 6, 8, 12 ]
      };

    }

    const manager: ComputedManager = mockManager(ComputedManager);

    expect(manager.context.numbers).toHaveLength(6);
    expect(manager.context.computed.greaterThanFive).toHaveLength(3);

    manager.setContext({ numbers: [ 1, 2, 10 ] });

    expect(manager.context.numbers).toHaveLength(3);
    expect(manager.context.computed.greaterThanFive).toHaveLength(1);
  });

  it("should validate provided params object", () => {
    expect(() => createComputed("" as any)).toThrow(DreamstateError);
    expect(() => createComputed(null as any)).toThrow(DreamstateError);
    expect(() => createComputed(undefined as any)).toThrow(DreamstateError);
    expect(() => createComputed(false as any)).toThrow(DreamstateError);
    expect(() => createComputed(0 as any)).toThrow(DreamstateError);
    expect(() => createComputed({} as any)).toThrow(DreamstateError);
    expect(() => createComputed(() => ({}), "" as any)).toThrow(DreamstateError);
    expect(() => createComputed(() => ({}), 0 as any)).toThrow(DreamstateError);
    expect(() => createComputed(() => ({}), false as any)).toThrow(DreamstateError);
    expect(() => createComputed(() => ({}), {} as any)).toThrow(DreamstateError);
    expect(() => createComputed(() => ({}))).not.toThrow();
    expect(() =>
      createComputed(
        () => ({}),
        () => []
      )).not.toThrow();
    expect(getCallableError<DreamstateError>(() => createComputed(false as any)).code).toBe(
      EDreamstateErrorCode.INCORRECT_PARAMETER
    );
  });
});
