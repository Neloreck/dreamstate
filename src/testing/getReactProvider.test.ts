import { Context } from "react";

import { getReactProvider } from "./getReactProvider";

import { ITestContext, TestContextManager } from "@Tests/assets";

describe("Get react provider util.", () => {
  it("Should properly get service provider.", () => {
    const context: Context<ITestContext> = TestContextManager.REACT_CONTEXT;

    expect(context.Provider).toBe(getReactProvider(TestContextManager));
  });
});
