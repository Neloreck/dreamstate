import { createElement, PureComponent, ReactElement, ReactNode } from "react";
import { Consume, ContextManager, createProvider, Provide, useManager, withConsumption } from "../../src";

/**
 * Utils for react tree testing.
 * Some example context managers and components using it.
 */

export interface IExampleContext {
  exampleNumber: number;
  exampleString: string;
  exampleActions: {
    setExampleNumber(value: number): void;
    setExampleString(value: string): void;
  };
}

export class ExampleContextManager extends ContextManager<IExampleContext> {

  public readonly context: IExampleContext = {
    exampleActions: {
      setExampleNumber: this.setExampleNumber.bind(this),
      setExampleString: this.setExampleString.bind(this)
    },
    exampleNumber: 0,
    exampleString: "initial",
  };

  public setExampleNumber(value: number): void {
    this.setContext({ exampleNumber: value });
  }

  public setExampleString(value: string): void {
    this.setContext({ exampleString: value });
  }

}

export interface IPlaceholderContext {
  placeholder: true;
}

export class PlaceholderContextManager extends ContextManager<IPlaceholderContext> {

  public readonly context: IPlaceholderContext = {
    placeholder: true
  };

}

export const Provider = createProvider([ ExampleContextManager, PlaceholderContextManager ]);

export const ExampleContextFunctionalProvider = Provider;

@Provide([ ExampleContextManager, PlaceholderContextManager ])
export class ExampleContextDecoratedProvider extends PureComponent {

  public render(): ReactNode {
    return this.props.children;
  }

}

export function ExampleContextFunctionalConsumer(): ReactElement {
  const value: IExampleContext = useManager(ExampleContextManager);

  return createElement("span", {}, JSON.stringify(value));
}

@Consume([ { from: ExampleContextManager, as: "exampleContext" } ])
export class ExampleContextClassConsumer extends PureComponent<{ exampleContext: IExampleContext }> {

  public render(): ReactNode {
    return createElement("span", {}, JSON.stringify(this.props.exampleContext));
  }

}

export const ExampleContextHocConsumer = withConsumption([ { from: ExampleContextManager, as: "exampleContext" } ])(
  class ExampleHoCedComponent extends PureComponent<{ exampleContext: IExampleContext }> {

    public render(): ReactNode {
      return createElement("span", {}, JSON.stringify(this.props.exampleContext));
    }

  }
);
