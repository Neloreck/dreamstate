import { ITestContext, TestContextManager } from "@Lib/fixtures";
import { getReactConsumer } from "@Lib/test-utils/utils/getReactConsumer";
import { Context } from "react";


describe("Get react consumer util.", () => {
  it("Should properly get service consumer.", () => {
    const context: Context<ITestContext> = TestContextManager.REACT_CONTEXT;

    expect(context.Consumer).toBe(getReactConsumer(TestContextManager));
  });
});
