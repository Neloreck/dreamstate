import { mount } from "enzyme";
import React, { ReactElement } from "react";

import { ScopeProvider, useScope } from "@/dreamstate";
import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TestContextManager } from "@/fixtures";

describe("createProvider method", () => {
  const CombinedProvider = createProvider([ TestContextManager ], { isCombined: true });
  const ScopedProvider = createProvider([ TestContextManager ], { isCombined: false });

  it("Should render correct component tree", async () => {
    let currentScope: IScopeContext = null as any;

    function ScopeConsumer(): ReactElement {
      const scope: IScopeContext = useScope();

      currentScope = scope as IScopeContext;

      return <div> Content </div>;
    }

    const combinedTree = mount(<ScopeProvider>
      <CombinedProvider>
        <ScopeConsumer/>
      </CombinedProvider>
    </ScopeProvider>);

    expect(combinedTree).toMatchSnapshot();
    expect(currentScope.INTERNAL.REGISTRY.CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeTruthy();

    combinedTree.unmount();

    expect(currentScope.INTERNAL.REGISTRY.CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeFalsy();

    const scopedTree = mount(<ScopeProvider>
      <ScopedProvider>
        <ScopeConsumer/>
      </ScopedProvider>
    </ScopeProvider>);

    expect(scopedTree).toMatchSnapshot();
    expect(currentScope.INTERNAL.REGISTRY.CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeTruthy();

    scopedTree.unmount();

    expect(currentScope.INTERNAL.REGISTRY.CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeFalsy();
  });

  it("Should create observers with validation", () => {
    expect(() => createProvider(0 as any)).toThrow(TypeError);
    expect(() => createProvider("0" as any)).toThrow(TypeError);
    expect(() => createProvider(false as any)).toThrow(TypeError);
    expect(() => createProvider(null as any)).toThrow(TypeError);
    expect(() => createProvider(null as any)).toThrow(TypeError);
    expect(() => createProvider([ null as any ])).toThrow(TypeError);
    expect(() => createProvider([ 0 as any ])).toThrow(TypeError);
    expect(() => createProvider([ "0" as any ])).toThrow(TypeError);
    expect(() => createProvider([ false as any ])).toThrow(TypeError);
    expect(() => createProvider([ {} as any ])).toThrow(TypeError);
    expect(() => createProvider([ new Function() as any ])).toThrow(TypeError);
    expect(() => createProvider([ [] as any ])).toThrow(TypeError);
    expect(() => createProvider([ class ExampleClass {} as any ])).toThrow(TypeError);
    expect(() => createProvider([])).toThrow();

    expect(() => createProvider([ TestContextManager ])).not.toThrow();
  });

  it("Should create correct component tree without children", () => {
    const combinedTree = mount(<ScopeProvider>
      <CombinedProvider>
        <div> testChild </div>
      </CombinedProvider>
    </ScopeProvider>);
    const scopedTree = mount(<ScopeProvider>
      <ScopedProvider>
        <div> testChild </div>
      </ScopedProvider>
    </ScopeProvider>);

    expect(combinedTree.render()).toMatchSnapshot();
    expect(scopedTree.render()).toMatchSnapshot();
    expect(combinedTree).toMatchSnapshot();
    expect(scopedTree).toMatchSnapshot();
  });
});
