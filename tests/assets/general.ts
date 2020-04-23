import { ContextManager } from "../../src/management";

export interface ITestContext {
  first: string;
  second: number;
}

export class TestContextManager extends ContextManager<ITestContext> {

  public readonly context: ITestContext = {
    first: "first",
    second: 2
  };

}

export class ExtendingTestContextManager extends TestContextManager {

  public concat(): string {
    return this.context.first + this.context.second;
  }

}

export class TestSingleContextManager extends ContextManager<ITestContext> {

  protected static IS_SINGLE: boolean = true;

  public readonly context: ITestContext = {
    first: "first",
    second: 2
  };

}

export class ExtendingTestSingleContextManager extends TestSingleContextManager {

  public concat(): string {
    return this.context.first + this.context.second;
  }

}

export interface INestedContext {
  first: {
    a: number;
    b: number;
  };
  second: {
    c: number;
    d: number;
  };
}

export class NestedContextManager extends ContextManager<INestedContext> {

  public readonly context: INestedContext = {
    first: {
      a: 1,
      b: 2
    },
    second: {
      c: 3,
      d: 4
    }
  };

}
