import { mount } from "enzyme";
import { createElement } from "react";
import { act } from "react-dom/test-utils";

import { getCurrent } from "@/dreamstate/core/registry/getCurrent";
import { ExampleContextClassConsumer, ExampleContextFunctionalProvider, ExampleContextManager } from "@/fixtures";

describe("React tree for provided and consumed components.", () => {
  it("Should correctly update subscribed to functional provider elements view.", () => {
    const reactTree = mount(
      createElement(ExampleContextFunctionalProvider, {} as any, createElement(ExampleContextClassConsumer))
    );

    expect(reactTree).toMatchSnapshot("Initial state.");

    const exampleContextManager: ExampleContextManager | null = getCurrent(ExampleContextManager);

    expect(exampleContextManager).not.toBeNull();

    act(() => {
      exampleContextManager!.setExampleNumber(101010);
      exampleContextManager!.setExampleString("updated");
    });

    reactTree.update();

    expect(reactTree).toMatchSnapshot("Updated state.");
  });
});
