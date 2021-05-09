import { mount } from "enzyme";
import { default as React, ReactElement } from "react";
import { act } from "react-dom/test-utils";

import { ScopeProvider, useManager, useScope } from "@/dreamstate";
import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { getCurrent } from "@/dreamstate/test-utils/registry/getCurrent";
import { ITestContext, TestContextManager } from "@/fixtures";

describe("React tree for provided and consumed components", () => {
  it("Should correctly update subscribed to functional provider elements view", () => {
    const ContextProvider = createProvider([ TestContextManager ]);

    function Root(): ReactElement {
      return (
        <ScopeProvider>
          <ContextProvider>
            <Consumer/>
          </ContextProvider>
        </ScopeProvider>
      );
    }

    let testContextManager: TestContextManager | null = null;

    function Consumer(): ReactElement {
      const scope: IScopeContext = useScope();
      const context: ITestContext = useManager(TestContextManager);

      testContextManager = getCurrent(TestContextManager, scope);

      return <div> { JSON.stringify(context) }</div>;
    }

    const reactTree = mount(<Root/>);

    expect(reactTree.render()).toMatchSnapshot();

    act(() => {
      testContextManager!.setContext({ first: "updated", second: 101010, third: true });
    });

    expect(testContextManager!.context.first).toBe("updated");
    expect(testContextManager!.context.second).toBe(101010);
    expect(testContextManager!.context.third).toBe(true);

    reactTree.update();
    expect(reactTree.render()).toMatchSnapshot();

    reactTree.unmount();
  });
});
