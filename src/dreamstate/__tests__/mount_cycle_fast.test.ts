import { mount } from "enzyme";
import { createElement } from "react";

import {
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SERVICES_ACTIVATED,
  CONTEXT_SERVICES_REGISTRY
} from "@/dreamstate/core/internals";
import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { TestContextManager, TestContextService } from "@/fixtures";

describe("Mount order for providers.", () => {
  const Provider = createProvider([ TestContextManager, TestContextService ]);

  it("Should properly have ready state if it was mounted-unmounted many times.", async () => {
    for (let it = 0; it < 1000; it ++) {
      const tree = mount(createElement(Provider, {}));

      tree.unmount();
    }

    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(0);
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SERVICES_REGISTRY.get(TestContextManager)).toBeUndefined();
    expect(CONTEXT_SERVICES_REGISTRY.get(TestContextService)).toBeUndefined();
  });

  it("Should properly have ready state if it was mounted-unmounted many times and left mounted.", async () => {
    let tree = mount(createElement(Provider, {}));

    for (let it = 0; it < 1000; it ++) {
      tree.unmount();

      tree = mount(createElement(Provider, {}));
    }

    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(2);
    expect(CONTEXT_STATES_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SERVICES_REGISTRY.get(TestContextManager)).toBeDefined();
    expect(CONTEXT_SERVICES_REGISTRY.get(TestContextService)).toBeDefined();
  });
});
