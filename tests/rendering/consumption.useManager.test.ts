import { createElement } from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

import { getCurrentManager } from "../../src/registry";

import { nextAsyncQueue } from "../helpers";
import {
  ExampleContextFunctionalConsumerWithUseEffect,
  ExampleContextFunctionalProvider,
  ExampleContextManager,
  IExampleContext
} from "../assets";

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

    const manager: ExampleContextManager = getCurrentManager(ExampleContextManager)!;

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

    const manager: ExampleContextManager = getCurrentManager(ExampleContextManager)!;

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
});
