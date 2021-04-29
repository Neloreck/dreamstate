import { mount } from "enzyme";
import { createElement } from "react";

import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { getCurrent } from "@/dreamstate/core/registry/getCurrent";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { TAnyObject } from "@/dreamstate/types";

describe("Initial state provision on service registration", () => {
  class ContextManagerWithInitialState extends ContextManager<TAnyObject, { service: string }> {

    public context: TAnyObject = {};

    public constructor(public initialState?: { num: string }) {
      super();
    }

  }

  const Provider = createProvider([ ContextManagerWithInitialState ]);

  it("Should properly query data while mounting", async () => {
    const tree = mount(createElement(Provider, { initialState: { str: "word", num: -1 } }));
    const contextManager: ContextManagerWithInitialState = getCurrent(ContextManagerWithInitialState)!;

    expect(contextManager.initialState?.num).toBe(-1);

    tree.unmount();
  });
});
