import { mount } from "enzyme";
import { createElement } from "react";

import { createProvider } from "@Lib";
import { CONTEXT_STATES_REGISTRY, CONTEXT_WORKERS_ACTIVATED, CONTEXT_WORKERS_REGISTRY } from "@Lib/internals";

import { TestContextManager, TestContextWorker } from "@Tests/assets";

describe("Mount order for providers.", () => {
  const Provider = createProvider([ TestContextManager, TestContextWorker ]);

  it("Should properly have ready state if it was mounted-unmounted many times.", async () => {
    for (let it = 0; it < 1000; it ++) {
      const tree = mount(createElement(Provider, {}));

      tree.unmount();
    }

    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(0);
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeUndefined();
  });

  it("Should properly have ready state if it was mounted-unmounted many times and left mounted.", async () => {
    let tree = mount(createElement(Provider, {}));

    for (let it = 0; it < 1000; it ++) {
      tree.unmount();

      tree = mount(createElement(Provider, {}));
    }

    expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(2);
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeDefined();
  });
});
