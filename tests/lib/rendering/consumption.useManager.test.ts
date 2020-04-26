import { createElement } from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

import { getCurrent } from "@Lib/registry";
import { nextAsyncQueue, registerWorkerClass } from "@Lib/test-utils";

import {
  ExampleContextFunctionalConsumer,
  ExampleContextFunctionalConsumerWithMemo,
  ExampleContextFunctionalConsumerWithUseEffect,
  ExampleContextFunctionalProvider,
  ExampleContextManager,
  IExampleContext
} from "@Tests/assets";
import { CONTEXT_WORKERS_REGISTRY } from "@Lib/internals";

describe("UseManager subscription and rendering.", () => {
  it("Functional components should properly subscribe to managers without diff-checking cb.", async () => {
    const mockFn = jest.fn(() => {});
    const tree = mount(
      createElement(
        ExampleContextFunctionalProvider,
        {},
        createElement(ExampleContextFunctionalConsumerWithUseEffect, {
          onUpdate: mockFn
        })
      )
    );

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(tree).toMatchSnapshot();

    mockFn.mockClear();

    const manager: ExampleContextManager = getCurrent(ExampleContextManager)!;

    await act(async () => {
      manager.setContext({ exampleNumber: manager.context.exampleNumber });
      await nextAsyncQueue();
    });

    expect(mockFn).not.toHaveBeenCalled();

    mockFn.mockClear();

    await act(async () => {
      manager.setContext({ exampleNumber: 100 });
      await nextAsyncQueue();
    });

    expect(mockFn).toHaveBeenCalled();

    mockFn.mockClear();

    await act(async () => {
      manager.setContext({ exampleString: "anotherString" });
      await nextAsyncQueue();
    });

    expect(mockFn).toHaveBeenCalled();

    mockFn.mockClear();
    tree.unmount();
  });

  it("Functional components should properly subscribe to managers with diff-checking cb.", async () => {
    const mockFn = jest.fn(() => {});
    const tree = mount(
      createElement(
        ExampleContextFunctionalProvider,
        {},
        createElement(ExampleContextFunctionalConsumerWithUseEffect, {
          onUpdate: mockFn,
          onCheckContextDiff: (context: IExampleContext) => [ context.exampleString ]
        })
      )
    );

    expect(tree).toMatchSnapshot();
    expect(mockFn).toHaveBeenCalledTimes(1);

    mockFn.mockClear();

    const manager: ExampleContextManager = getCurrent(ExampleContextManager)!;

    await act(async () => {
      manager.setContext({ exampleString: manager.context.exampleString });
      await nextAsyncQueue();
    });

    expect(mockFn).not.toHaveBeenCalled();

    mockFn.mockClear();

    await act(async () => {
      manager.setContext({ exampleNumber: 100 });
      await nextAsyncQueue();
    });

    expect(mockFn).not.toHaveBeenCalled();
    mockFn.mockClear();

    await act(async () => {
      manager.setContext({ exampleString: "anotherString" });
      await nextAsyncQueue();
    });

    expect(mockFn).toHaveBeenCalled();

    mockFn.mockClear();
    tree.unmount();
  });

  it("Should properly fire onProvisionStarted for functional observers.", async () => {
    const manager: ExampleContextManager = registerWorkerClass(ExampleContextManager);

    manager["onProvisionStarted"] = jest.fn();
    manager["onProvisionEnded"] = jest.fn();

    const tree = mount(
      createElement(
        ExampleContextFunctionalProvider,
        {},
        createElement(ExampleContextFunctionalConsumer, {})
      )
    );

    await nextAsyncQueue();

    expect(manager["onProvisionStarted"]).toHaveBeenCalled();

    tree.unmount();

    await nextAsyncQueue();
    await nextAsyncQueue();

    expect(manager["onProvisionEnded"]).toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.has(ExampleContextManager)).toBeFalsy();
  });

  it("Should properly fire onProvisionStarted for functional subscribers.", async () => {
    const manager: ExampleContextManager = registerWorkerClass(ExampleContextManager);

    manager["onProvisionStarted"] = jest.fn();
    manager["onProvisionEnded"] = jest.fn();

    const tree = mount(
      createElement(
        ExampleContextFunctionalProvider,
        {},
        createElement(ExampleContextFunctionalConsumerWithMemo, {})
      )
    );

    await nextAsyncQueue();

    expect(manager["onProvisionStarted"]).toHaveBeenCalled();

    tree.unmount();

    await nextAsyncQueue();

    expect(manager["onProvisionEnded"]).toHaveBeenCalled();
    expect(CONTEXT_WORKERS_REGISTRY.has(ExampleContextManager)).toBeFalsy();
  });
});
