import { Context } from "react";

import { getReactConsumer } from "./getReactConsumer";

import { ITestContext, TestContextManager } from "@Tests/assets";

describe("Get react consumer util.", () => {
  it("Should properly get worker consumer.", () => {
    const context: Context<ITestContext> = TestContextManager.REACT_CONTEXT;

    expect(context.Consumer).toBe(getReactConsumer(TestContextManager));
  });
});
