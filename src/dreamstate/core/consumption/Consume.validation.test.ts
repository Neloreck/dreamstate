import { mount, ReactWrapper } from "enzyme";
import { ComponentType, createElement, PureComponent } from "react";

import { Consume } from "@/dreamstate/core/consumption/Consume";
import { withConsumption } from "@/dreamstate/core/consumption/withConsumption";
import {
  ITestContext,
  PropsRenderer,
  TestContextManager,
  TextContextManagerProvider
} from "@/fixtures";

describe("@Consume selector validation", () => {
  function mountProvided(element: ComponentType<object>): ReactWrapper {
    return mount(createElement(TextContextManagerProvider, {}, createElement(element, {})));
  }

  it("Hoc alias should be same as decorator", () => {
    expect(Consume).toBe(withConsumption);
  });

  it("Should take only valid classes or types and throw exception", () => {
    expect(() => Consume([ class Any {} as any ])(PureComponent)).toThrow(TypeError);
    expect(() => Consume(class Any {} as any)(PureComponent)).toThrow(TypeError);
    expect(() => Consume([ { from: class Any {} as any } ])(PureComponent)).toThrow(TypeError);
    expect(() => Consume(1 as any)(PureComponent)).toThrow(TypeError);
    expect(() => Consume("a" as any)(PureComponent)).toThrow(TypeError);
    expect(() => Consume(true as any)(PureComponent)).toThrow(TypeError);
    expect(() => Consume([ 1 as any ])(PureComponent)).toThrow(TypeError);
    expect(() => Consume([ "a" as any ])(PureComponent)).toThrow(TypeError);
    expect(() => Consume([ true as any ])(PureComponent)).toThrow(TypeError);
  });

  it("Should properly validate selectors", () => {
    expect(() => Consume([ TestContextManager ])(PureComponent)).not.toThrow();
    expect(() => Consume([ { from: TestContextManager } ])(PureComponent)).not.toThrow();
    expect(() => Consume([ { from: TestContextManager, take: [] } ])(PureComponent)).not.toThrow();
    expect(() => Consume([ { from: TestContextManager, take: () => ({}) } ])(PureComponent)).not.toThrow();
    expect(() => Consume([ { from: TestContextManager, as: "any" } ])(PureComponent)).not.toThrow();
    expect(() => Consume([ { from: TestContextManager, take: "a" as any } ])(PureComponent)).not.toThrow();
    expect(() => Consume([ { from: TestContextManager, take: 1 as any } ])(PureComponent)).not.toThrow();
    expect(() => Consume([ { from: TestContextManager, take: {} as any } ])(PureComponent)).toThrow();
    expect(() => Consume([ { from: TestContextManager, take: null as any } ])(PureComponent)).toThrow();
    expect(() => Consume([ { from: 1 as any } ])(PureComponent)).toThrow();
    expect(() => Consume([ { from: null as any } ])(PureComponent)).toThrow();
    expect(() => Consume([ { from: false as any } ])(PureComponent)).toThrow();
    expect(() => Consume([ { from: TestContextManager, as: {} as any } ])(PureComponent)).toThrow(TypeError);
  });

  it("Should properly select all properties with or without alias", () => {
    const TestComponent = Consume([ TestContextManager ])(PropsRenderer) as ComponentType<any>;
    const TestComponentWithSelector = Consume([ { from: TestContextManager } ])(PropsRenderer) as ComponentType<any>;
    const TestComponentWithAlias = Consume([
      { from: TestContextManager, as: "aliased" }
    ])(PropsRenderer) as ComponentType<any>;

    expect(mountProvided(TestComponent)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithAlias)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithSelector)).toMatchSnapshot();
  });

  it("Should properly select string properties with or without alias", () => {
    const TestComponentWithSelector = Consume([
      { from: TestContextManager, take: "first" }
    ])(PropsRenderer) as ComponentType<any>;
    const TestComponentWithAlias = Consume([
      { from: TestContextManager, take: "second", as: "aliased" }
    ])(PropsRenderer) as ComponentType<any>;
    const TestComponentWithFallbackSelector = Consume([
      { from: TestContextManager, take: 55 as any }
    ])(PropsRenderer) as ComponentType<any>;

    expect(mountProvided(TestComponentWithSelector)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithAlias)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithFallbackSelector)).toMatchSnapshot();
  });

  it("Should properly select array properties with or without alias", () => {
    const TestComponentWithNoProps = Consume([
      { from: TestContextManager, take: [] }
    ])(PropsRenderer) as ComponentType<any>;
    const TestComponentWithNoPropsAliased = Consume([
      { from: TestContextManager, take: [] }
    ])(PropsRenderer) as ComponentType<any>;
    const TestComponentWithSecondProp = Consume([ { from: TestContextManager, take: [ "second" ] } ])(
      PropsRenderer
    ) as ComponentType<any>;
    const TestComponentWithAllProps = Consume([ { from: TestContextManager, take: [ "first", "second" ] } ])(
      PropsRenderer
    ) as ComponentType<any>;
    const TestComponentWithAllPropsAliased = Consume([
      { from: TestContextManager, take: [ "first", "second" ], as: "alias" }
    ])(PropsRenderer) as ComponentType<any>;

    expect(mountProvided(TestComponentWithNoProps)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithNoPropsAliased)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithSecondProp)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithAllProps)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithAllPropsAliased)).toMatchSnapshot();
  });

  it("Should properly select selector properties with or without alias", () => {
    const TestComponentWithAllProps = Consume([
      { from: TestContextManager, take: (context: ITestContext) => context }
    ])(PropsRenderer) as ComponentType<any>;
    const TestComponentWithAllPropsAliased = Consume([
      {
        from: TestContextManager,
        take: (context: ITestContext) => context,
        as: "custom"
      }
    ])(PropsRenderer) as ComponentType<any>;
    const TestComponentWithCustomSelector = Consume([
      {
        from: TestContextManager,
        take: (context: ITestContext) => ({
          a: context.first,
          b: context.second
        })
      }
    ])(PropsRenderer) as ComponentType<any>;
    const TestComponentWithCustomSelectorAliased = Consume([
      {
        from: TestContextManager,
        take: (context: ITestContext) => ({ a: context.first }),
        as: "custom"
      }
    ])(PropsRenderer) as ComponentType<any>;

    expect(mountProvided(TestComponentWithAllProps)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithAllPropsAliased)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithCustomSelector)).toMatchSnapshot();
    expect(mountProvided(TestComponentWithCustomSelectorAliased)).toMatchSnapshot();
  });
});
