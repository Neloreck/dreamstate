import { mount } from "enzyme";
import { createElement, PureComponent, ReactNode } from "react";

import { Provide } from "./Provide";
import { CONTEXT_WORKERS_ACTIVATED } from "../internals";

import { TestContextManager, TestContextWorker, TestSingleContextWorker } from "@Tests/assets";

describe("@Provide decorator.", () => {
  @Provide([ TestContextManager, TestContextWorker, TestSingleContextWorker ])
  class ExampleProvided extends PureComponent {

    public render(): ReactNode {
      return "test";
    }

  }

  it("Should render correct component tree.", async () => {
    expect(CONTEXT_WORKERS_ACTIVATED.has(TestContextWorker)).toBeFalsy();
    expect(CONTEXT_WORKERS_ACTIVATED.has(TestContextManager)).toBeFalsy();
    expect(CONTEXT_WORKERS_ACTIVATED.has(TestSingleContextWorker)).toBeFalsy();

    const tree = mount(createElement(ExampleProvided, {}));

    expect(tree).toMatchSnapshot();

    expect(CONTEXT_WORKERS_ACTIVATED.has(TestContextWorker)).toBeTruthy();
    expect(CONTEXT_WORKERS_ACTIVATED.has(TestContextManager)).toBeTruthy();
    expect(CONTEXT_WORKERS_ACTIVATED.has(TestSingleContextWorker)).toBeTruthy();

    tree.unmount();

    expect(CONTEXT_WORKERS_ACTIVATED.has(TestContextWorker)).toBeFalsy();
    expect(CONTEXT_WORKERS_ACTIVATED.has(TestContextManager)).toBeFalsy();
    expect(CONTEXT_WORKERS_ACTIVATED.has(TestSingleContextWorker)).toBeTruthy();
  });
});
