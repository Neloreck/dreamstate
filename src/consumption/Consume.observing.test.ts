import { ComponentType, createElement } from "react";
import { mount, ReactWrapper } from "enzyme";
import { act } from "react-dom/test-utils";

import { Consume } from "./index";
import { getCurrent } from "../registry";
import { nextAsyncQueue, registerService, unRegisterService } from "../testing";

import { ITestContext, RenderCallbacker, TestContextManager, TextContextManagerProvider } from "@Tests/assets";

describe("@Consume selector observing.", () => {
  function mountProvided<T extends object>(element: ComponentType<T>, props: T): ReactWrapper {
    return mount(createElement(TextContextManagerProvider, {}, createElement(element, props)));
  }

  beforeEach(() => {
    registerService(TestContextManager);
  });

  afterEach(() => {
    unRegisterService(TestContextManager);
  });

  it("Should properly observe only one property and prevent odd updates.", async () => {
    const manager: TestContextManager = getCurrent(TestContextManager)!;
    const Observer = Consume([ { from: TestContextManager, take: "first" } ])(RenderCallbacker) as ComponentType<any>;
    const onRender = jest.fn();

    const tree = mountProvided(Observer, { onRender });

    expect(tree).toMatchSnapshot();
    expect(onRender).toHaveBeenCalledTimes(1);

    onRender.mockClear();

    await act(async () => {
      manager.setContext({ first: "anotherValue" });
      await nextAsyncQueue();
    });

    tree.update();

    expect(tree).toMatchSnapshot();
    expect(onRender).toHaveBeenCalledTimes(1);

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
    expect(onRender).not.toHaveBeenCalled();

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
    expect(onRender).not.toHaveBeenCalled();
  });

  it("Should properly observe array selected props and prevent odd updates.", async () => {
    const manager: TestContextManager = getCurrent(TestContextManager)!;
    const Observer = Consume([
      { from: TestContextManager, take: [ "first", "third" ] }
    ])(RenderCallbacker)as ComponentType<any>;
    const onRender = jest.fn();

    const tree = mountProvided(Observer, { onRender });

    expect(tree).toMatchSnapshot();
    expect(onRender).toHaveBeenCalledTimes(1);

    onRender.mockClear();

    await act(async () => {
      manager.setContext({ first: "anotherValue" });
      await nextAsyncQueue();
    });

    tree.update();

    expect(tree).toMatchSnapshot();
    expect(onRender).toHaveBeenCalledTimes(1);

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
    expect(onRender).not.toHaveBeenCalled();

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
    expect(onRender).not.toHaveBeenCalled();

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
    expect(onRender).toHaveBeenCalledTimes(1);

    onRender.mockClear();
  });

  it("Should properly observe selector picked props and prevent odd updates.", async () => {
    const manager: TestContextManager = getCurrent(TestContextManager)!;
    const Observer = Consume([
      {
        from: TestContextManager,
        take: (context: ITestContext) => ({ prop: context.second })
      }
    ])(RenderCallbacker) as ComponentType<any> ;
    const onRender = jest.fn();

    const tree = mountProvided(Observer, { onRender });

    expect(tree).toMatchSnapshot();
    expect(onRender).toHaveBeenCalledTimes(1);

    onRender.mockClear();

    await act(async () => {
      manager.setContext({ first: "anotherValue" });
      await nextAsyncQueue();
    });

    tree.update();

    expect(tree).toMatchSnapshot();
    expect(onRender).not.toHaveBeenCalled();

    onRender.mockClear();

    await act(async () => {
      manager.setContext({ second: 56656 });
      await nextAsyncQueue();
    });

    tree.update();

    expect(tree).toMatchSnapshot();
    expect(onRender).toHaveBeenCalled();

    onRender.mockClear();
  });
});
