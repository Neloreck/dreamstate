import { mount } from "enzyme";
import { default as React, ReactElement } from "react";

import { createProvider, ScopeProvider, useScope } from "@/dreamstate";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { getCurrent } from "@/dreamstate/test-utils/registry/getCurrent";
import { TestContextManager } from "@/fixtures";

describe("getCurrent method functionality", () => {
  it("Should properly return current service instance", () => {
    let globalScope: IScopeContext = null as any;

    const Provider = createProvider([ TestContextManager ]);

    function Consumer(): ReactElement {
      const scope: IScopeContext = useScope();

      globalScope = scope as IScopeContext;

      return <div> sample </div>;
    }

    const emptyTree = mount(<ScopeProvider> <Consumer/> </ScopeProvider>);

    expect(globalScope).not.toBeUndefined();
    expect(getCurrent(TestContextManager, globalScope)).toBeNull();

    emptyTree.unmount();

    expect(getCurrent(TestContextManager, globalScope)).toBeNull();

    const providedTree = mount(<ScopeProvider>
      <Provider>
        <Consumer/>
      </Provider>
    </ScopeProvider>);

    expect(globalScope).not.toBeUndefined();
    expect(getCurrent(TestContextManager, globalScope)).not.toBeNull();
    expect(getCurrent(TestContextManager, globalScope)).toBeInstanceOf(TestContextManager);
    expect(getCurrent(TestContextManager, globalScope)?.context.first).toBe("first");

    providedTree.unmount();

    expect(globalScope).not.toBeUndefined();
    expect(getCurrent(TestContextManager, globalScope)).toBeNull();
  });
});
