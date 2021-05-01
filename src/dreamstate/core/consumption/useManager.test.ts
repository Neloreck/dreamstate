import { mount, render } from "enzyme";
import { createElement, ReactElement, useEffect } from "react";
import { act } from "react-dom/test-utils";

import { createProvider, useManager } from "@/dreamstate";
import { CONTEXT_SERVICES_REGISTRY } from "@/dreamstate/core/internals";
import { getCurrent } from "@/dreamstate/test-utils/registry/getCurrent";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";
import { TAnyContextManagerConstructor, TAnyObject, TCallable } from "@/dreamstate/types";
import {
  TestContextManager,
  ITestContext
} from "@/fixtures";

describe("UseManager subscription and rendering", () => {
  function FunctionalConsumerWithUseEffect<T extends TAnyContextManagerConstructor>({
    onUpdate,
    onCheckContextDiff
  }: {
    onUpdate: TCallable;
    onCheckContextDiff?: (context: T["prototype"]["context"]) => Array<any>;
  }): ReactElement {
    const context: TAnyObject = useManager(TestContextManager as any, onCheckContextDiff as any);

    useEffect(onUpdate);

    return createElement("div", {}, JSON.stringify(context));
  }

  function FunctionalConsumer(): ReactElement {
    const value: ITestContext = useManager(TestContextManager);

    return createElement("span", {}, JSON.stringify(value));
  }

  function FunctionalConsumerWithMemo(): ReactElement {
    const value: ITestContext = useManager(TestContextManager, ({ second }) => [ second ]);

    return createElement("span", {}, JSON.stringify(value));
  }

  it("Functional components should properly subscribe to managers without diff-checking cb", async () => {
    const getRoot = () => (
      createElement(
        createProvider([ TestContextManager ]),
        {},
        createElement(FunctionalConsumerWithUseEffect, {
          onUpdate: mockFn
        })
      )
    );

    const mockFn = jest.fn();
    const tree = mount(getRoot());

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(render(getRoot())).toMatchSnapshot();

    mockFn.mockClear();

    const manager: TestContextManager = getCurrent(TestContextManager)!;

    await act(async () => {
      manager.setContext({ second: manager.context.second });
      await nextAsyncQueue();
    });

    expect(mockFn).not.toHaveBeenCalled();

    mockFn.mockClear();

    await act(async () => {
      manager.setContext({ second: 100 });
      await nextAsyncQueue();
    });

    expect(mockFn).toHaveBeenCalled();

    mockFn.mockClear();

    await act(async () => {
      manager.setContext({ first: "anotherString" });
      await nextAsyncQueue();
    });

    expect(mockFn).toHaveBeenCalled();

    mockFn.mockClear();
    tree.unmount();
  });

  it("Functional components should properly subscribe to managers with diff-checking cb", async () => {
    const getRoot = () => (
      createElement(
        createProvider([ TestContextManager ]),
        {},
        createElement(FunctionalConsumerWithUseEffect, {
          onUpdate: mockFn,
          onCheckContextDiff: (context: ITestContext) => [ context.first ]
        })
      )
    );

    const mockFn = jest.fn(() => {});
    const tree = mount(getRoot());

    expect(render(getRoot())).toMatchSnapshot();
    expect(mockFn).toHaveBeenCalledTimes(1);

    mockFn.mockClear();

    const manager: TestContextManager = getCurrent(TestContextManager)!;

    await act(async () => {
      manager.setContext({ second: 100 });
      await nextAsyncQueue();
    });

    expect(mockFn).not.toHaveBeenCalled();
    mockFn.mockClear();

    await act(async () => {
      manager.setContext({ first: "anotherString" });
      await nextAsyncQueue();
    });

    expect(mockFn).toHaveBeenCalled();

    mockFn.mockClear();
    tree.unmount();
  });

  it("Should properly fire provision events for functional observers", async () => {
    const manager: TestContextManager = registerService(TestContextManager);

    manager["onProvisionStarted"] = jest.fn();
    manager["onProvisionEnded"] = jest.fn();

    const tree = mount(
      createElement(
        createProvider([ TestContextManager ]),
        {},
        createElement(FunctionalConsumer, {})
      )
    );

    await nextAsyncQueue();

    expect(manager["onProvisionStarted"]).toHaveBeenCalled();

    tree.unmount();

    await nextAsyncQueue();
    await nextAsyncQueue();

    expect(manager["onProvisionEnded"]).toHaveBeenCalled();
    expect(CONTEXT_SERVICES_REGISTRY.has(TestContextManager)).toBeFalsy();
  });

  it("Should properly fire provision events for functional subscribers", async () => {
    const manager: TestContextManager = registerService(TestContextManager);

    manager["onProvisionStarted"] = jest.fn();
    manager["onProvisionEnded"] = jest.fn();

    const tree = mount(
      createElement(
        createProvider([ TestContextManager ]),
        {},
        createElement(FunctionalConsumerWithMemo, {})
      )
    );

    await nextAsyncQueue();

    expect(manager["onProvisionStarted"]).toHaveBeenCalled();

    tree.unmount();

    await nextAsyncQueue();

    expect(manager["onProvisionEnded"]).toHaveBeenCalled();
    expect(CONTEXT_SERVICES_REGISTRY.has(TestContextManager)).toBeFalsy();
  });
});
