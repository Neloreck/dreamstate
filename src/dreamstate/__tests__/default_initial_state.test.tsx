import { mount } from "enzyme";
import React, { ReactElement } from "react";

import { ContextManager, createProvider, ScopeProvider, useScope } from "@/dreamstate";
import { IPublicScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { getCurrent } from "@/dreamstate/test-utils";
import { TAnyObject } from "@/dreamstate/types";

describe("Initial state provision on service registration", () => {
  interface IInitialState {
    str: string;
    num: number;
  }

  class ContextManagerWithInitialState extends ContextManager<TAnyObject, IInitialState> {

    public context: TAnyObject = {};
    public num: number;

    public constructor(initialState?: IInitialState) {
      super();

      this.num = initialState?.num || 0;
    }

  }

  const Provider = createProvider([ ContextManagerWithInitialState ]);

  it("Should properly query data while mounting", async () => {
    let contextManager: ContextManagerWithInitialState | null = null;

    function Consumer(): ReactElement {
      const scope: IPublicScopeContext = useScope();

      contextManager = getCurrent(ContextManagerWithInitialState, scope);

      return <div> sample </div>;
    }

    const tree = mount(<ScopeProvider>
      <Provider initialState={{ str: "word", num: -1 }}>
        <Consumer/>
      </Provider>
    </ScopeProvider>);

    expect(contextManager!.num).toBe(-1);

    tree.unmount();
  });
});
