import { Context } from "react";

import { getReactProvider } from "@/dreamstate/test-utils/utils/getReactProvider";
import { ITestContext, TestContextManager } from "@/fixtures";

describe("Get react provider util.", () => {
  it("Should properly get service provider.", () => {
    const context: Context<ITestContext> = TestContextManager.REACT_CONTEXT;

    expect(context.Provider).toBe(getReactProvider(TestContextManager));
  });
});
