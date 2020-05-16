import { Suite } from "benchmark";
import { Consume, ContextManager, createProvider, Provide, useManager } from "dreamstate";
import { render, configure } from "enzyme";
import {
  Context,
  createContext,
  createElement,
  PropsWithChildren,
  PureComponent,
  ReactElement,
  ReactNode,
  useContext
} from "react";
import { Provider, connect } from "react-redux";
import { createStore } from "redux";

interface ISomeContext {
  a: string;
  b: number;
}

class SomeManager extends ContextManager<ISomeContext> {

  public context: ISomeContext = { a: "a", b: 0 };

}

const SomeManagerProvider = createProvider([ SomeManager ]);

function FunctionalProvidedComponent(props: object): ReactElement {
  return createElement(SomeManagerProvider, props);
}

@Provide([ SomeManager ])
class ClassProvidedComponent extends PureComponent {

  public render(): ReactNode {
    return this.props.children;
  }

}

function FunctionalConsumedComponent({ data = useManager(SomeManager) }: { data: ISomeContext }): ReactElement {
  return createElement("div", {},JSON.stringify(data));
}

@Consume([ SomeManager ])
class ClassConsumedComponent extends PureComponent {

  public render(): ReactNode {
    return createElement("div", {}, JSON.stringify(this.props));
  }

}

const sampleContext: Context<ISomeContext> = createContext({ a: "-", b: 0 });

function ReactFunctionalProvider(props: PropsWithChildren<object>): ReactElement {
  return createElement(sampleContext.Provider, { value: { a: "1", b: 1 } }, props.children);
}

function ReactFunctionalConsumer({ data = useContext(sampleContext) }: { data: ISomeContext }): ReactElement {
  return createElement("div", {}, JSON.stringify(data));
}

const ReduxStore = createStore((state: ISomeContext = { a: "a", b: 10 }) => state);

function ReduxProvider(props: PropsWithChildren<object>) {
  return createElement(Provider, { store: ReduxStore }, props.children);
}

const ReduxConsumer = connect((state: ISomeContext) => state)(function(props: object): ReactElement {
  return createElement("div", {}, JSON.stringify(props));
});

configure({ adapter: new (require("enzyme-adapter-react-16"))() });

export const suite = new Suite()
  .add("render#react-context", () => {
    render(createElement(ReactFunctionalProvider, {}, createElement(ReactFunctionalConsumer)));
  })
  .add("render#dreamstate-functional", () => {
    render(createElement(FunctionalProvidedComponent, {}, createElement(FunctionalConsumedComponent)));
  })
  .add("render#dreamstate-classes", () => {
    render(createElement(ClassProvidedComponent, {}, createElement(ClassConsumedComponent)));
  })
  .add("render#redux-functional", () => {
    render(createElement(ReduxProvider, {}, createElement(ReduxConsumer)));
  });
