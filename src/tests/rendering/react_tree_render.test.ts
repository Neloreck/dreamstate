import { mount } from "enzyme";
import { createElement } from "react";
import {
  ExampleContextClassConsumer,
  ExampleContextDecoratedProvider,
  ExampleContextFunctionalConsumer,
  ExampleContextFunctionalProvider
} from "./test_assets";

describe("React tree for provided and consumed components.", () => {
  it("Should correctly provide manager context from functional provider.", () => {
    const functionalFunctionalTree = mount(
      createElement(ExampleContextFunctionalProvider,
        {} as any,
        createElement(ExampleContextFunctionalConsumer))
    );

    expect(functionalFunctionalTree).toMatchSnapshot("Provision: Functional - Functional.");

    const functionalDecoratedTree = mount(
      createElement(ExampleContextFunctionalProvider,
        {} as any,
        createElement(ExampleContextClassConsumer))
    );

    expect(functionalDecoratedTree).toMatchSnapshot("Provision: Functional - Decorated.");
  });

  it("Should correctly provide manager context from decorated HoC provider.", () => {
    const decoratedFunctionalTree = mount(
      createElement(ExampleContextDecoratedProvider,
        {} as any,
        createElement(ExampleContextFunctionalConsumer))
    );

    expect(decoratedFunctionalTree).toMatchSnapshot("Provision: Decorated - Functional.");

    const decoratedDecoratedTree = mount(
      createElement(ExampleContextDecoratedProvider,
        {} as any,
        createElement(ExampleContextClassConsumer))
    );

    expect(decoratedDecoratedTree).toMatchSnapshot("Provision: Decorated - Decorated.");
  });
});
