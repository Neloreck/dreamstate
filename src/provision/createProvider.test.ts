import { mount } from "enzyme";
import { createElement } from "react";

import { CONTEXT_SERVICES_ACTIVATED } from "../internals";

import { TestContextManager, TestContextService, TestSingleContextService } from "@Tests/assets";
import { createProvider } from "@Lib";

describe("createProvider method.", () => {
  const Provider = createProvider([ TestContextManager, TestContextService, TestSingleContextService ]);

  it("Should render correct component tree.", async () => {
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextService)).toBeFalsy();
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeFalsy();
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestSingleContextService)).toBeFalsy();

    const tree = mount(createElement(Provider, {}, "test"));

    expect(tree).toMatchSnapshot();

    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextService)).toBeTruthy();
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeTruthy();
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestSingleContextService)).toBeTruthy();

    tree.unmount();

    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextService)).toBeFalsy();
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeFalsy();
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestSingleContextService)).toBeTruthy();
  });
});
