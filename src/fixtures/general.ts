import { createElement, PropsWithChildren, ReactElement } from "react";

import { createProvider } from "@Lib/provision/createProvider";
import { ContextManager } from "@Lib/management/ContextManager";
import { ContextService } from "@Lib/management/ContextService";

export interface ITestContext {
  first: string;
  second: number;
  third: boolean;
}

export class TestContextManager extends ContextManager<ITestContext> {

  public readonly context: ITestContext = {
    first: "first",
    second: 2,
    third: false
  };

}

export const TextContextManagerProvider = createProvider([ TestContextManager ]);

export class TestContextService extends ContextService {
}

export class TestSingleContextService extends ContextService {

  protected static IS_SINGLE: boolean = true;

  public createdAt: number = performance.now();

}

export class ExtendingTestContextManager extends TestContextManager {
}

export class TestSingleContextManager extends ContextManager<ITestContext> {

  protected static IS_SINGLE: boolean = true;

  public readonly context: ITestContext = {
    first: "first",
    second: 2,
    third: false
  };

}

export class ExtendingTestSingleContextManager extends TestSingleContextManager {
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

export class BasicClassExample {

  public a: number = 15;
  public b: string = "example";

}

export function PropsRenderer(props: PropsWithChildren<object>): ReactElement {
  return createElement("div", {}, JSON.stringify(props));
}

export function RenderCallbacker({ onRender, ...rest }: { onRender: <T>(props: T) => void }): ReactElement {
  onRender(rest);

  return createElement("div", {}, JSON.stringify(rest));
}
