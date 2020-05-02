import { createElement } from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

import { getCurrent } from "@Lib/registry";
import { nextAsyncQueue, registerWorker, unRegisterWorker } from "@Lib/test-utils";

import { EmittingContextManager, ESignal, TStringSignalEvent, UsingSignalFunction } from "@Tests/assets";

describe("Signals and signaling.", () => {
  beforeEach(() => {
    registerWorker(EmittingContextManager);
  });

  afterEach(() => {
    unRegisterWorker(EmittingContextManager);
  });

  it("Functional components should properly subscribe to signals and update ui.", async () => {
    const emittingContextManager: EmittingContextManager = getCurrent(EmittingContextManager)!;

    const mockFn = jest.fn((signalEvent: TStringSignalEvent) => {
      expect(signalEvent.type).toBe(ESignal.STRING_SIGNAL);
      expect(signalEvent.emitter).toBe(EmittingContextManager);
      expect(signalEvent.data).toBe("newValue");
    });
    const tree = mount(
      createElement(UsingSignalFunction, { onInternalSignal: (event: TStringSignalEvent) => mockFn(event) })
    );

    expect(tree).toMatchSnapshot();

    await act(async () => {
      emittingContextManager.sendStringSignal("newValue");

      await nextAsyncQueue();
    });

    tree.update();

    expect(tree).toMatchSnapshot();
    expect(mockFn).toHaveBeenCalled();

    mockFn.mockClear();

    tree.unmount();

    emittingContextManager.sendStringSignal("newValue");
    await nextAsyncQueue();

    expect(mockFn).not.toHaveBeenCalled();
  });
});
