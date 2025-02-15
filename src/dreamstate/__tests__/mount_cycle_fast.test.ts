import { mount, render } from "enzyme";
import { createElement } from "react";

import { createProvider, ScopeProvider, useScope } from "@/dreamstate";
import { TestManager } from "@/fixtures";

describe("Mount order for providers", () => {
  const Provider = createProvider([TestManager]);

  it("should properly have ready state if it was mounted-unmounted many times", async () => {
    for (let it = 0; it < 1000; it ++) {
      const tree = mount(createElement(ScopeProvider, {}, createElement(Provider, {})));

      tree.unmount();
    }

    render(
      createElement(ScopeProvider, {}, () => {
        const {
          INTERNAL: {
            REGISTRY: { CONTEXT_STATES_REGISTRY, CONTEXT_INSTANCES_REGISTRY },
          },
        } = useScope();

        expect(CONTEXT_STATES_REGISTRY.get(TestManager)).toBeUndefined();
        expect(CONTEXT_INSTANCES_REGISTRY.get(TestManager)).toBeUndefined();

        return null;
      })
    );
  });

  it("should properly have ready state if it was mounted-unmounted many times and left mounted", async () => {
    let tree = mount(createElement(ScopeProvider, {}, createElement(Provider, {})));

    for (let it = 0; it < 1000; it ++) {
      tree.unmount();

      tree = mount(createElement(ScopeProvider, {}, createElement(Provider, {})));
    }

    render(
      createElement(ScopeProvider, {}, () => {
        const {
          INTERNAL: {
            REGISTRY: { CONTEXT_STATES_REGISTRY, CONTEXT_INSTANCES_REGISTRY },
          },
        } = useScope();

        expect(CONTEXT_STATES_REGISTRY.get(TestManager)).toBeDefined();
        expect(CONTEXT_INSTANCES_REGISTRY.get(TestManager)).toBeDefined();

        return null;
      })
    );
  });
});
