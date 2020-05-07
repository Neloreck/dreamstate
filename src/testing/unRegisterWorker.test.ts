import {
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_QUERY_METADATA_REGISTRY,
  CONTEXT_REACT_CONTEXTS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_SIGNAL_METADATA_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY,
  CONTEXT_WORKERS_ACTIVATED,
  CONTEXT_WORKERS_REGISTRY
} from "../internals";
import { registerWorker, unRegisterWorker } from "./index";

import { TestContextWorker, TestSingleContextWorker } from "@Tests/assets";

describe("Unregister worker test util.", () => {
  it("Should properly unregister workers without errors.", () => {
    registerWorker(TestContextWorker);
    unRegisterWorker(TestContextWorker);
  });

  it("Should not remove singletons with force flag.", () => {
    registerWorker(TestSingleContextWorker);
    unRegisterWorker(TestSingleContextWorker, false);

    expect(CONTEXT_WORKERS_REGISTRY.get(TestSingleContextWorker)).toBeDefined();
  });

  it("Should force remove singletons by default.", () => {
    registerWorker(TestSingleContextWorker);
    unRegisterWorker(TestSingleContextWorker);

    expect(CONTEXT_WORKERS_REGISTRY.get(TestSingleContextWorker)).toBeUndefined();
  });

  it("Workers should be de-initialized after test.", () => {
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeUndefined();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextWorker)).toBeInstanceOf(Set);
    expect(CONTEXT_QUERY_METADATA_REGISTRY.get(TestContextWorker)).toBeUndefined();
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextWorker)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextWorker)).toBeUndefined();
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.get(TestContextWorker)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextWorker)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextWorker)).toBeUndefined();
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(0);
  });
});
