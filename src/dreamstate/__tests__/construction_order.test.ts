import { mount } from "enzyme";
import { createElement } from "react";

import { ContextManager, ScopeProvider } from "@/dreamstate";
import { createProvider } from "@/dreamstate/core/provision/createProvider";

describe("Mount order for providers", () => {
  it("should create elements in an expected order", async () => {
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

    const CombinedProvider = createProvider([First, Second, Third], {
      isCombined: true,
    });
    const ScopedProvider = createProvider([First, Second, Third], {
      isCombined: false,
    });
    let list: Array<string> = [];

    const combinedTree = mount(createElement(ScopeProvider, {}, createElement(CombinedProvider, {})));

    combinedTree.unmount();

    expect(list).toHaveLength(3);
    expect(list[0]).toBe(First.name);
    expect(list[1]).toBe(Second.name);
    expect(list[2]).toBe(Third.name);

    list = [];

    const scopedTree = mount(createElement(ScopeProvider, {}, createElement(ScopedProvider, {})));

    scopedTree.unmount();

    expect(list).toHaveLength(3);
    expect(list[0]).toBe(First.name);
    expect(list[1]).toBe(Second.name);
    expect(list[2]).toBe(Third.name);
  });
});
