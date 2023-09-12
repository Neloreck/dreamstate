import { Context } from "react";

import { getReactProvider } from "@/dreamstate/test-utils/utils/getReactProvider";
import { ITestContext, TestManager } from "@/fixtures";

describe("Get react provider util", () => {
  it("should properly get service provider", () => {
    const context: Context<ITestContext> = TestManager.REACT_CONTEXT;

    expect(context.Provider).toBe(getReactProvider(TestManager));
  });
});
