import { ComponentType, createElement, PureComponent } from "react";
import { mount, ReactWrapper } from "enzyme";

import { Consume, withConsumption } from "@Lib/consumption";
import {
  BasicClassExample,
  ExampleContextManager,
  ITestContext,
  PropsRenderer,
  TestContextManager,
  TextContextManagerProvider
} from "@Tests/assets";

describe("HoC @Consume and withConsumption selector validation.", () => {
  function mountProvided(element: ComponentType<object>): ReactWrapper {
    return mount(createElement(TextContextManagerProvider, {}, createElement(element, {})));
  }

  it("Hoc alias should be same as decorator.", () => {
    expect(withConsumption).toBe(Consume);
  });

  it("Should take only valid classes or types and throw exception.", () => {
    expect(() => withConsumption([ BasicClassExample as any ])(PureComponent)).toThrow(TypeError);
    expect(() => withConsumption(BasicClassExample as any)(PureComponent)).toThrow(TypeError);
    expect(() => withConsumption([ { from: BasicClassExample as any } ])(PureComponent)).toThrow(TypeError);
    expect(() => withConsumption(1 as any)(PureComponent)).toThrow(TypeError);
    expect(() => withConsumption("a" as any)(PureComponent)).toThrow(TypeError);
    expect(() => withConsumption(true as any)(PureComponent)).toThrow(TypeError);
    expect(() => withConsumption([ 1 as any ])(PureComponent)).toThrow(TypeError);
    expect(() => withConsumption([ "a" as any ])(PureComponent)).toThrow(TypeError);
    expect(() => withConsumption([ true as any ])(PureComponent)).toThrow(TypeError);
  });

  it("Should properly validate selectors.", () => {
    expect(() => withConsumption([ ExampleContextManager ])(PureComponent)).not.toThrow();
    expect(() => withConsumption([ { from: ExampleContextManager } ])(PureComponent)).not.toThrow();
    expect(() => withConsumption([ { from: ExampleContextManager, take: [] } ])(PureComponent)).not.toThrow();
    expect(() => withConsumption([ { from: ExampleContextManager, take: () => ({}) } ])(PureComponent)).not.toThrow();
    expect(() => withConsumption([ { from: ExampleContextManager, as: "any" } ])(PureComponent)).not.toThrow();
    expect(() => withConsumption([ { from: ExampleContextManager, take: "a" as any } ])(PureComponent)).not.toThrow();
    expect(() => withConsumption([ { from: ExampleContextManager, take: 1 as any } ])(PureComponent)).not.toThrow();
    expect(() => withConsumption([ { from: ExampleContextManager, take: {} as any } ])(PureComponent)).toThrow();
    expect(() => withConsumption([ { from: ExampleContextManager, take: null as any } ])(PureComponent)).toThrow();
    expect(() => withConsumption([ { from: 1 as any } ])(PureComponent)).toThrow();
    expect(() => withConsumption([ { from: null as any } ])(PureComponent)).toThrow();
    expect(() => withConsumption([ { from: false as any } ])(PureComponent)).toThrow();
    expect(() => withConsumption([ { from: ExampleContextManager, as: {} as any } ])(PureComponent)).toThrow(TypeError);
  });

  it("Should properly select all properties with or without alias.", () => {
    const TestComponent = withConsumption([ TestContextManager ])(PropsRenderer);
    const TestComponentWithSelector = withConsumption([ { from: TestContextManager } ])(PropsRenderer);
    const TestComponentWithAlias = withConsumption([ { from: TestContextManager, as: "aliased" } ])(PropsRenderer);

    expect(mountProvided(TestComponent)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithAlias)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithSelector)).toMatchSnapshot();
  });

  it("Should properly select string properties with or without alias.", () => {
    const TestComponentWithSelector = withConsumption([ { from: TestContextManager, take: "first" } ])(PropsRenderer);
    const TestComponentWithAlias = withConsumption([
      { from: TestContextManager, take: "second", as: "aliased" }
    ])(PropsRenderer);
    const TestComponentWithFallbackSelector = withConsumption([
      { from: TestContextManager, take: 55 as any }
    ])(PropsRenderer);

    expect(mountProvided(TestComponentWithSelector)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithAlias)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithFallbackSelector)).toMatchSnapshot();
  });

  it("Should properly select array properties with or without alias.", () => {
    const TestComponentWithNoProps = withConsumption([ { from: TestContextManager, take: [] } ])(PropsRenderer);
    const TestComponentWithNoPropsAliased = withConsumption([ { from: TestContextManager, take: [] } ])(PropsRenderer);
    const TestComponentWithSecondProp = withConsumption([ { from: TestContextManager, take: [ "second" ] } ])(
      PropsRenderer
    );
    const TestComponentWithAllProps = withConsumption([ { from: TestContextManager, take: [ "first", "second" ] } ])(
      PropsRenderer
    );
    const TestComponentWithAllPropsAliased = withConsumption([
      { from: TestContextManager, take: [ "first", "second" ], as: "alias" }
    ])(PropsRenderer);

    expect(mountProvided(TestComponentWithNoProps)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithNoPropsAliased)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithSecondProp)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithAllProps)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithAllPropsAliased)).toMatchSnapshot();
  });

  it("Should properly select selector properties with or without alias.", () => {
    const TestComponentWithAllProps = withConsumption([
      { from: TestContextManager, take: (context: ITestContext) => context }
    ])(PropsRenderer);
    const TestComponentWithAllPropsAliased = withConsumption([
      {
        from: TestContextManager,
        take: (context: ITestContext) => context,
        as: "custom"
      }
    ])(PropsRenderer);
    const TestComponentWithCustomSelector = withConsumption([
      {
        from: TestContextManager,
        take: (context: ITestContext) => ({
          a: context.first,
          b: context.second
        })
      }
    ])(PropsRenderer);
    const TestComponentWithCustomSelectorAliased = withConsumption([
      {
        from: TestContextManager,
        take: (context: ITestContext) => ({ a: context.first }),
        as: "custom"
      }
    ])(PropsRenderer);

    expect(mountProvided(TestComponentWithAllProps)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithAllPropsAliased)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithCustomSelector)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithCustomSelectorAliased)).toMatchSnapshot();
  });
});
