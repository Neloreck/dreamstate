import { ComponentType, createElement } from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

import { withConsumption } from "../../src/consumption";
import { getCurrentManager } from "../../src/registry";

import {
  ITestContext,
  RenderCallbacker,
  TestContextManager,
  TextContextManagerProvider
} from "../assets";
import { nextAsyncQueue, registerManagerClass, unRegisterManagerClass } from "../helpers";

describe("HoC @Consume and withConsumption selector observing.", () => {
  function mountProvided<T extends object>(element: ComponentType<T>, props: T): ReactWrapper {
    return mount(createElement(TextContextManagerProvider, {}, createElement(element, props)));
  }

  beforeEach(() => {
    registerManagerClass(TestContextManager);
  });

  afterEach(() => {
    unRegisterManagerClass(TestContextManager);
  });

  it("Should properly observe only one property and prevent odd updates.", async () => {
    const manager: TestContextManager = getCurrentManager(TestContextManager)!;
    const Observer = withConsumption([ { from: TestContextManager, take: "first" } ])(RenderCallbacker);
    const onRender = jest.fn();

    const tree = mountProvided(Observer, { onRender });

    expect(tree).toMatchSnapshot();
    expect(onRender).toBeCalledTimes(1);

    onRender.mockClear();

    await act(async () => {
      manager.setContext({ first: "anotherValue" });
      await nextAsyncQueue();
    });

    tree.update();

    expect(tree).toMatchSnapshot();
    expect(onRender).toBeCalledTimes(1);

    onRender.mockClear();

    /**
     * Set same state again.
     */
    await act(async () => {
      manager.setContext({ first: "anotherValue" });
      await nextAsyncQueue();
    });

    tree.update();

    expect(tree).toMatchSnapshot();
    expect(onRender).not.toBeCalled();

    onRender.mockClear();

    /**
     * Set not observed context property.
     */
    await act(async () => {
      manager.setContext({ second: 9000 });
      await nextAsyncQueue();
    });

    tree.update();

    expect(tree).toMatchSnapshot();
    expect(onRender).not.toBeCalled();
  });

  it("Should properly observe array selected props and prevent odd updates.", async () => {
    const manager: TestContextManager = getCurrentManager(TestContextManager)!;
    const Observer = withConsumption([ { from: TestContextManager, take: [ "first", "third" ] } ])(RenderCallbacker);
    const onRender = jest.fn();

    const tree = mountProvided(Observer, { onRender });

    expect(tree).toMatchSnapshot();
    expect(onRender).toBeCalledTimes(1);

    onRender.mockClear();

    await act(async () => {
      manager.setContext({ first: "anotherValue" });
      await nextAsyncQueue();
    });

    tree.update();

    expect(tree).toMatchSnapshot();
    expect(onRender).toBeCalledTimes(1);

    onRender.mockClear();

    /**
     * Set same state again.
     */
    await act(async () => {
      manager.setContext({ first: "anotherValue" });
      await nextAsyncQueue();
    });

    tree.update();

    expect(tree).toMatchSnapshot();
    expect(onRender).not.toBeCalled();

    onRender.mockClear();

    /**
     * Set not observed context property.
     */
    await act(async () => {
      manager.setContext({ second: 9000 });
      await nextAsyncQueue();
    });

    tree.update();

    expect(tree).toMatchSnapshot();
    expect(onRender).not.toBeCalled();

    onRender.mockClear();

    /**
     * Set additional array-observed property.
     */
    await act(async () => {
      manager.setContext({ third: true });
      await nextAsyncQueue();
    });

    tree.update();

    expect(tree).toMatchSnapshot();
    expect(onRender).toBeCalledTimes(1);

    onRender.mockClear();
  });

  it("Should properly observe selector picked props and prevent odd updates.", async () => {
    const manager: TestContextManager = getCurrentManager(TestContextManager)!;
    const Observer = withConsumption([
      { from: TestContextManager, take: (context: ITestContext) => ({ prop: context.second }) }
    ])(RenderCallbacker);
    const onRender = jest.fn();

    const tree = mountProvided(Observer, { onRender });

    expect(tree).toMatchSnapshot();
    expect(onRender).toBeCalledTimes(1);

    onRender.mockClear();

    await act(async () => {
      manager.setContext({ first: "anotherValue" });
      await nextAsyncQueue();
    });

    tree.update();

    expect(tree).toMatchSnapshot();
    expect(onRender).not.toBeCalled();

    onRender.mockClear();

    await act(async () => {
      manager.setContext({ second: 56656 });
      await nextAsyncQueue();
    });

    tree.update();

    expect(tree).toMatchSnapshot();
    expect(onRender).toBeCalled();

    onRender.mockClear();
  });
});
