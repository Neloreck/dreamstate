import { mount } from "enzyme";
import { createElement } from "react";

import { CONTEXT_WORKERS_ACTIVATED } from "../internals";

import { TestContextManager, TestContextWorker, TestSingleContextWorker } from "@Tests/assets";
import { createProvider } from "@Lib";

describe("createProvider method.", () => {
  const Provider = createProvider([ TestContextManager, TestContextWorker, TestSingleContextWorker ]);

  it("Should render correct component tree.", async () => {
    expect(CONTEXT_WORKERS_ACTIVATED.has(TestContextWorker)).toBeFalsy();
    expect(CONTEXT_WORKERS_ACTIVATED.has(TestContextManager)).toBeFalsy();
    expect(CONTEXT_WORKERS_ACTIVATED.has(TestSingleContextWorker)).toBeFalsy();

    const tree = mount(createElement(Provider, {}, "test"));

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
