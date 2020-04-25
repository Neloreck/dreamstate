import { createElement } from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";

import { getCurrentManager } from "../../src/registry";

import { nextAsyncQueue, registerManagerClass, unRegisterManagerClass } from "../helpers";
import { EmittingContextManager, ESignal, TStringSignalEvent, UsingSignalFunction } from "../assets";

describe("Signals and signaling.", () => {
  beforeEach(() => {
    registerManagerClass(EmittingContextManager);
  });

  afterEach(() => {
    unRegisterManagerClass(EmittingContextManager);
  });

  it("Functional components should properly subscribe to signals and update ui.", async () => {
    const emittingContextManager: EmittingContextManager = getCurrentManager(EmittingContextManager)!;

    const mockFn = jest.fn((signalEvent: TStringSignalEvent) => {
      expect(signalEvent.type).toBe(ESignal.STRING_SIGNAL);
      expect(signalEvent.emitter).toBe(emittingContextManager);
      expect(signalEvent.data).toBe("newValue");
    });
    const tree = mount(createElement(UsingSignalFunction, { onInternalSignal: mockFn }));

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
