import { mount } from "enzyme";
import { createElement } from "react";
import { act } from "react-dom/test-utils";

import { getCurrent } from "@/dreamstate/core/registry/getCurrent";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";
import { unRegisterService } from "@/dreamstate/test-utils/registry/unRegisterService";
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";
import { EmittingContextManager, ESignal, TStringSignalEvent, SubscribedFunctionalComponent } from "@/fixtures/signals";

describe("useSignals method", () => {
  beforeEach(() => {
    registerService(EmittingContextManager);
  });

  afterEach(() => {
    unRegisterService(EmittingContextManager);
  });

  it("Functional components should properly subscribe to signals and update ui", async () => {
    const emittingContextManager: EmittingContextManager = getCurrent(EmittingContextManager)!;

    const mockFn = jest.fn((signalEvent: TStringSignalEvent) => {
      expect(signalEvent.type).toBe(ESignal.STRING_SIGNAL);
      expect(signalEvent.emitter).toBe(EmittingContextManager);
      expect(signalEvent.data).toBe("newValue");
    });
    const tree = mount(
      createElement(SubscribedFunctionalComponent, { onInternalSignal: (event: TStringSignalEvent) => mockFn(event) })
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
