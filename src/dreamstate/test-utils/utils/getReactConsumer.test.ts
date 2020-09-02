import { Context } from "react";

import { getReactConsumer } from "@/dreamstate/test-utils/utils/getReactConsumer";
import { ITestContext, TestContextManager } from "@/fixtures";

describe("Get react consumer util", () => {
  it("Should properly get service consumer", () => {
    const context: Context<ITestContext> = TestContextManager.REACT_CONTEXT;

    expect(context.Consumer).toBe(getReactConsumer(TestContextManager));
  });
});
