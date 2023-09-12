import { Context } from "react";

import { getReactConsumer } from "@/dreamstate/test-utils/utils/getReactConsumer";
import { ITestContext, TestManager } from "@/fixtures";

describe("Get react consumer util", () => {
  it("should properly get service consumer", () => {
    const context: Context<ITestContext> = TestManager.REACT_CONTEXT;

    expect(context.Consumer).toBe(getReactConsumer(TestManager));
  });
});
