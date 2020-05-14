import { ITestContext, TestContextManager } from "@Lib/fixtures";
import { getReactProvider } from "@Lib/test-utils/utils/getReactProvider";
import { Context } from "react";


describe("Get react provider util.", () => {
  it("Should properly get service provider.", () => {
    const context: Context<ITestContext> = TestContextManager.REACT_CONTEXT;

    expect(context.Provider).toBe(getReactProvider(TestContextManager));
  });
});
