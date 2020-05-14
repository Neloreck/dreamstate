import { mount } from "enzyme";
import { createElement, PureComponent, ReactNode } from "react";

import { CONTEXT_SERVICES_ACTIVATED } from "@/dreamstate/core/internals";
import { Provide } from "@/dreamstate/core/provision/Provide";
import { TestContextManager, TestContextService, TestSingleContextService } from "@/fixtures";

describe("@Provide decorator.", () => {
  @Provide([ TestContextManager, TestContextService, TestSingleContextService ])
  class ExampleProvided extends PureComponent {

    public render(): ReactNode {
      return "test";
    }

  }

  it("Should render correct component tree.", async () => {
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextService)).toBeFalsy();
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeFalsy();
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestSingleContextService)).toBeFalsy();

    const tree = mount(createElement(ExampleProvided, {}));

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
