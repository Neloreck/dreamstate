import { mount } from "enzyme";
import { createElement } from "react";

import { ContextManager } from "@/dreamstate";
import { CONTEXT_SERVICES_ACTIVATED } from "@/dreamstate/core/internals";
import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { getCurrent } from "@/dreamstate/test-utils/registry/getCurrent";
import { registerService } from "@/dreamstate/test-utils/registry/registerService";

describe("Mount order for providers", () => {
  it("Should create elements in an expected order", async () => {
    class First extends ContextManager {

      public constructor() {
        super();
        list.push(First.name);
      }

    }

    class Second extends ContextManager {

      public constructor() {
        super();
        list.push(Second.name);
      }

    }

    class Third extends ContextManager {

      public constructor() {
        super();
        list.push(Third.name);
      }

    }

    const CombinedProvider = createProvider([ First, Second, Third ], { isCombined: true });
    const ScopedProvider = createProvider([ First, Second, Third ], { isCombined: false });
    let list: Array<string> = [];

    const combinedTree = mount(createElement(CombinedProvider, {}));

    combinedTree.unmount();

    expect(list).toHaveLength(3);
    expect(list[0]).toBe(First.name);
    expect(list[1]).toBe(Second.name);
    expect(list[2]).toBe(Third.name);

    list = [];

    const scopedTree = mount(createElement(ScopedProvider, {}));

    scopedTree.unmount();

    expect(list).toHaveLength(3);
    expect(list[0]).toBe(First.name);
    expect(list[1]).toBe(Second.name);
    expect(list[2]).toBe(Third.name);
  });
});
