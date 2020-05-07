import { Context } from "react";

import {
  EMPTY_ARR,
  CONTEXT_WORKERS_ACTIVATED,
  CONTEXT_REACT_CONTEXTS_REGISTRY,
  CONTEXT_WORKERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY,
  CONTEXT_SIGNAL_HANDLERS_REGISTRY,
  CONTEXT_SIGNAL_METADATA_REGISTRY,
  CONTEXT_QUERY_METADATA_REGISTRY,
  SIGNAL_LISTENERS_REGISTRY
} from "./internals";
import { unRegisterWorker } from "../registry";
import { registerWorker } from "../testing";

import { TestContextManager } from "@Tests/assets";

describe("Dreamstate internals.", () => {
  it("Should contain only listed objects.", () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const internals = require("./internals");

    expect(Object.keys(internals)).toHaveLength(11);
  });

  it("Internals should be initialized.", () => {
    expect(CONTEXT_WORKERS_ACTIVATED).toBeInstanceOf(Set);
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(0);

    expect(EMPTY_ARR).toBeInstanceOf(Array);
    expect(EMPTY_ARR).toHaveLength(0);

    expect(SIGNAL_LISTENERS_REGISTRY).toBeInstanceOf(Set);
    expect(SIGNAL_LISTENERS_REGISTRY.size).toBe(0);

    expect(CONTEXT_WORKERS_REGISTRY).toBeInstanceOf(WeakMap);
    expect(CONTEXT_OBSERVERS_REGISTRY).toBeInstanceOf(WeakMap);
    expect(CONTEXT_QUERY_METADATA_REGISTRY).toBeInstanceOf(WeakMap);
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY).toBeInstanceOf(WeakMap);
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY).toBeInstanceOf(WeakMap);
    expect(CONTEXT_STATES_REGISTRY).toBeInstanceOf(WeakMap);
    expect(CONTEXT_SUBSCRIBERS_REGISTRY).toBeInstanceOf(WeakMap);
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY).toBeInstanceOf(WeakMap);
  });

  it("Internals should not exist until first register.", () => {
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_QUERY_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(SIGNAL_LISTENERS_REGISTRY.size).toBe(0);
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(0);
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();

    registerWorker(TestContextManager);

    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined(); // No signal listeners here.
    expect(CONTEXT_SIGNAL_HANDLERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_QUERY_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined(); // No query listeners here.
    expect(SIGNAL_LISTENERS_REGISTRY.size).toBe(1);
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(1);
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();

    unRegisterWorker(TestContextManager);

    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SUBSCRIBERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SIGNAL_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_QUERY_METADATA_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(SIGNAL_LISTENERS_REGISTRY.size).toBe(0);
    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(0);
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();
  });

  // todo: Move?
  it("Related react context should be lazily initialized correctly with changed displayName.", () => {
    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeUndefined();

    const contextType: Context<object> = TestContextManager.REACT_CONTEXT;

    expect(CONTEXT_REACT_CONTEXTS_REGISTRY.get(TestContextManager)).toBeDefined();

    expect(contextType).not.toBeUndefined();
    expect(contextType.Consumer).not.toBeUndefined();
    expect(contextType.Provider).not.toBeUndefined();
    expect(contextType.displayName).toBe("DS." + TestContextManager.name);
  });
});
