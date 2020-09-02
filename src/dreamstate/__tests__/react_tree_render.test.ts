import { mount } from "enzyme";
import { createElement, PureComponent, ReactElement, ReactNode } from "react";

import { Consume } from "@/dreamstate/core/consumption/Consume";
import { useManager } from "@/dreamstate/core/consumption/useManager";
import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { Provide } from "@/dreamstate/core/provision/Provide";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { ContextService } from "@/dreamstate/core/services/ContextService";

describe("React tree for provided and consumed components", () => {
  interface IExampleContext {
    exampleNumber: number;
    exampleString: string;
    exampleActions: {
      setExampleNumber(value: number): void;
      setExampleString(value: string): void;
    };
  }

  class ExampleContextManager extends ContextManager<IExampleContext> {

    public readonly context: IExampleContext = {
      exampleActions: {
        setExampleNumber: this.setExampleNumber.bind(this),
        setExampleString: this.setExampleString.bind(this)
      },
      exampleNumber: 0,
      exampleString: "initial"
    };

    public setExampleNumber(value: number): void {
      this.setContext({ exampleNumber: value });
    }

    public setExampleString(value: string): void {
      this.setContext({ exampleString: value });
    }

  }

  class ProvidedService extends ContextService {
  }

  interface IPlaceholderContext {
    placeholder: true;
  }

  class PlaceholderContextManager extends ContextManager<IPlaceholderContext> {

    public readonly context: IPlaceholderContext = {
      placeholder: true
    };

  }

  const Provider = createProvider([ ExampleContextManager, PlaceholderContextManager, ProvidedService ]);

  const ExampleContextFunctionalProvider = Provider;

  @Provide([ ExampleContextManager, PlaceholderContextManager, ProvidedService ])
  class ExampleContextDecoratedProvider extends PureComponent {

    public render(): ReactNode {
      return this.props.children;
    }

  }

  function ExampleContextFunctionalConsumer(): ReactElement {
    const value: IExampleContext = useManager(ExampleContextManager);

    return createElement("span", {}, JSON.stringify(value));
  }

  @Consume([ { from: ExampleContextManager, as: "exampleContext" } ])
  class ExampleContextClassConsumer extends PureComponent<{
    exampleContext: IExampleContext;
  }> {

    public render(): ReactNode {
      return createElement("span", {}, JSON.stringify(this.props.exampleContext));
    }

  }

  it("Should correctly provide manager context from functional provider", () => {
    const functionalFunctionalTree = mount(
      createElement(ExampleContextFunctionalProvider, {} as any, createElement(ExampleContextFunctionalConsumer))
    );

    expect(functionalFunctionalTree).toMatchSnapshot("Provision: Functional - Functional.");

    const functionalDecoratedTree = mount(
      createElement(ExampleContextFunctionalProvider, {} as any, createElement(ExampleContextClassConsumer))
    );

    expect(functionalDecoratedTree).toMatchSnapshot("Provision: Functional - Decorated.");
  });

  it("Should correctly provide manager context from decorated HoC provider", () => {
    const decoratedFunctionalTree = mount(
      createElement(ExampleContextDecoratedProvider, {} as any, createElement(ExampleContextFunctionalConsumer))
    );

    expect(decoratedFunctionalTree).toMatchSnapshot("Provision: Decorated - Functional.");

    const decoratedDecoratedTree = mount(
      createElement(ExampleContextDecoratedProvider, {} as any, createElement(ExampleContextClassConsumer))
    );

    expect(decoratedDecoratedTree).toMatchSnapshot("Provision: Decorated - Decorated.");
  });
});
