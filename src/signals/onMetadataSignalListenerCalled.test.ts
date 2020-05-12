import { onMetadataSignalListenerCalled } from "./onMetadataSignalListenerCalled";
import { registerService, unRegisterService } from "../testing";
import { CONTEXT_SIGNAL_METADATA_REGISTRY } from "../internals";
import { ISignalEvent } from "../types";

import { ESignal, SubscribedContextManager, TestContextManager } from "@Tests/assets";

describe("onMetadataSignalListenerCalled method functionality.", () => {
  it("Should ignore services without metadata and not throw any errors.", () => {
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.has(TestContextManager)).toBeFalsy();

    onMetadataSignalListenerCalled.call(
      new TestContextManager(),
      {
        type: "TEST",
        timestamp: Date.now(),
        emitter: null,
        data: null,
        cancel: jest.fn()
      }
    );

    expect(true).toBeTruthy();
  });

  it("Should properly call single signal-subscribed methods for managers.", () => {
    const manager: SubscribedContextManager = registerService(SubscribedContextManager);

    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.has(SubscribedContextManager)).toBeTruthy();

    manager.onNumberSignal = jest.fn((signal: ISignalEvent) => {
      expect(signal.type).toBe(ESignal.NUMBER_SIGNAL);
    });

    onMetadataSignalListenerCalled.call(
      manager,
      {
        type: ESignal.NUMBER_SIGNAL,
        timestamp: Date.now(),
        emitter: null,
        data: null,
        cancel: jest.fn()
      }
    );

    expect(manager.onNumberSignal).toHaveBeenCalled();

    unRegisterService(SubscribedContextManager);
  });

  it("Should properly call array signal-subscribed methods for managers.", () => {
    const manager: SubscribedContextManager = registerService(SubscribedContextManager);

    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.has(SubscribedContextManager)).toBeTruthy();

    manager.onStringOrNumberSignal = jest.fn();

    onMetadataSignalListenerCalled.call(
      manager,
      {
        type: ESignal.NUMBER_SIGNAL,
        timestamp: Date.now(),
        emitter: null,
        data: null,
        cancel: jest.fn()
      }
    );
    onMetadataSignalListenerCalled.call(
      manager,
      {
        type: ESignal.STRING_SIGNAL,
        timestamp: Date.now(),
        emitter: null,
        data: null,
        cancel: jest.fn()
      }
    );

    expect(manager.onStringOrNumberSignal).toHaveBeenCalledTimes(2);

    unRegisterService(SubscribedContextManager);
  });

  it("Should ignore own signals.", () => {
    const manager: SubscribedContextManager = registerService(SubscribedContextManager);

    manager.onStringSignal = jest.fn(() => {
      throw new Error("Unreachable code");
    });

    onMetadataSignalListenerCalled.call(
      manager,
      {
        type: ESignal.STRING_SIGNAL,
        timestamp: Date.now(),
        emitter: SubscribedContextManager,
        data: null,
        cancel: jest.fn()
      }
    );
    expect(manager.onStringSignal).not.toHaveBeenCalled();

    unRegisterService(SubscribedContextManager);
  });
});
