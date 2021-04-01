import { mount } from "enzyme";
import { createElement } from "react";

import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { getCurrent } from "@/dreamstate/core/registry/getCurrent";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import { TAnyObject } from "@/dreamstate/types";

describe("Initial state provision on service registration", () => {
  class ContextServiceWithInitialState extends ContextService<{ service: string }> {

    public constructor(public initialState?: { str: string }) {
      super();
    }

  }

  class ContextManagerWithInitialState extends ContextManager<TAnyObject, { service: string }> {

    public context: TAnyObject = {};

    public constructor(public initialState?: { num: string }) {
      super();
    }

  }

  const Provider = createProvider([ ContextManagerWithInitialState, ContextServiceWithInitialState ]);

  it("Should properly query data while mounting", async () => {
    const tree = mount(createElement(Provider, { initialState: { str: "word", num: -1 } }));

    const contextService: ContextServiceWithInitialState = getCurrent(ContextServiceWithInitialState)!;
    const contextManager: ContextManagerWithInitialState = getCurrent(ContextManagerWithInitialState)!;

    expect(contextService.initialState?.str).toBe("word");
    expect(contextManager.initialState?.num).toBe(-1);

    tree.unmount();
  });
});
