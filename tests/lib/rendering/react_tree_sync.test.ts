import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { createElement } from "react";

import { getCurrentManager } from "@Lib";

import { ExampleContextClassConsumer, ExampleContextFunctionalProvider, ExampleContextManager } from "@Tests/assets";

describe("React tree for provided and consumed components.", () => {
  it("Should correctly update subscribed to functional provider elements view.", () => {
    const reactTree = mount(
      createElement(ExampleContextFunctionalProvider, {} as any, createElement(ExampleContextClassConsumer))
    );

    expect(reactTree).toMatchSnapshot("Initial state.");

    const exampleContextManager: ExampleContextManager | null = getCurrentManager(ExampleContextManager);

    expect(exampleContextManager).not.toBeNull();

    act(() => {
      exampleContextManager!.setExampleNumber(101010);
      exampleContextManager!.setExampleString("updated");
    });

    reactTree.update();

    expect(reactTree).toMatchSnapshot("Updated state.");
  });
});
