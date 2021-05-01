import { ContextManager } from "@/dreamstate";
import { processComputed } from "@/dreamstate/core/storing/processComputed";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { TComputed } from "@/dreamstate/types";
import { createComputed } from "@/dreamstate/utils/createComputed";

describe("createComputed method functionality", () => {
  it("Should create value with correct initial param", () => {
    const context = {
      first: createComputed(() => ({ nullValue: null })),
      second: createComputed(() => ({ test: 355 })),
      third: createComputed(() => ({ another: false }), () => [])
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

  it("Should correctly work with context managers", () => {
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
      }

    }

    const computedManager: ComputedManager = registerService(ComputedManager);

    expect(computedManager.context.testValue).toBe(25);
    expect(computedManager.context.example.multipliedByTwo).toBe(50);
    expect(computedManager.context.example.multipliedByThree).toBe(75);

    computedManager.setContext({ testValue: 1000 });

    expect(computedManager.context.testValue).toBe(1000);
    expect(computedManager.context.example.multipliedByTwo).toBe(2000);
    expect(computedManager.context.example.multipliedByThree).toBe(3000);

    unRegisterService(ComputedManager);
  });

  it("Should correctly compute non-primitive values", () => {
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
      }

    }

    const computedManager: ComputedManager = registerService(ComputedManager);

    expect(computedManager.context.numbers).toHaveLength(6);
    expect(computedManager.context.computed.greaterThanFive).toHaveLength(3);

    computedManager.setContext({ numbers: [ 1, 2, 10 ] });

    expect(computedManager.context.numbers).toHaveLength(3);
    expect(computedManager.context.computed.greaterThanFive).toHaveLength(1);

    unRegisterService(ComputedManager);
  });
});
