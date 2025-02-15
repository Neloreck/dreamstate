import { mount } from "enzyme";
import { default as React, ReactElement } from "react";

import { createProvider, ScopeProvider, useScope } from "@/dreamstate";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { getCurrent } from "@/dreamstate/test-utils/registry/getCurrent";
import { TUninitializedValue } from "@/dreamstate/types";
import { TestManager } from "@/fixtures";

describe("getCurrent method functionality", () => {
  it("should properly return current service instance", () => {
    let globalScope: IScopeContext = null as TUninitializedValue;

    const Provider = createProvider([TestManager]);

    function Consumer(): ReactElement {
      const scope: IScopeContext = useScope();

      globalScope = scope as IScopeContext;

      return <div> sample </div>;
    }

    const emptyTree = mount(
      <ScopeProvider>
        <Consumer/>
      </ScopeProvider>
    );

    expect(globalScope).toBeDefined();
    expect(getCurrent(TestManager, globalScope)).toBeNull();

    emptyTree.unmount();

    expect(getCurrent(TestManager, globalScope)).toBeNull();

    const providedTree = mount(
      <ScopeProvider>
        <Provider>
          <Consumer/>
        </Provider>
      </ScopeProvider>
    );

    expect(globalScope).toBeDefined();
    expect(getCurrent(TestManager, globalScope)).not.toBeNull();
    expect(getCurrent(TestManager, globalScope)).toBeInstanceOf(TestManager);
    expect(getCurrent(TestManager, globalScope)?.context.first).toBe("first");

    providedTree.unmount();

    expect(globalScope).toBeDefined();
    expect(getCurrent(TestManager, globalScope)).toBeNull();
  });
});
