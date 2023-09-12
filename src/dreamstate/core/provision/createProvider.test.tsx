import { mount } from "enzyme";
import { default as React, ReactElement } from "react";

import { DreamstateError, ScopeProvider, useScope } from "@/dreamstate";
import { createCombinedProvider } from "@/dreamstate/core/provision/combined/createCombinedProvider";
import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { createScopedProvider } from "@/dreamstate/core/provision/scoped/createScopedProvider";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { EDreamstateErrorCode } from "@/dreamstate/types";
import { getCallableError, TestManager } from "@/fixtures";

describe("createProvider method", () => {
  const CombinedProvider = createProvider([ TestManager ], { isCombined: true });
  const ScopedProvider = createProvider([ TestManager ], { isCombined: false });

  it("should render correct component tree", async () => {
    let currentScope: IScopeContext = null as any;

    function ScopeConsumer(): ReactElement {
      const scope: IScopeContext = useScope();

      currentScope = scope as IScopeContext;

      return <div> Content </div>;
    }

    const combinedTree = mount(
      <ScopeProvider>
        <CombinedProvider>
          <ScopeConsumer/>
        </CombinedProvider>
      </ScopeProvider>
    );

    expect(combinedTree).toMatchSnapshot();

    combinedTree.unmount();

    const scopedTree = mount(
      <ScopeProvider>
        <ScopedProvider>
          <ScopeConsumer/>
        </ScopedProvider>
      </ScopeProvider>
    );

    expect(scopedTree).toMatchSnapshot();

    scopedTree.unmount();
  });

  it("should create observers with validation", () => {
    expect(() => createProvider(0 as any)).toThrow(DreamstateError);
    expect(() => createProvider("0" as any)).toThrow(DreamstateError);
    expect(() => createProvider(false as any)).toThrow(DreamstateError);
    expect(() => createProvider(null as any)).toThrow(DreamstateError);
    expect(() => createProvider(null as any)).toThrow(DreamstateError);
    expect(() => createProvider([ null as any ])).toThrow(DreamstateError);
    expect(() => createProvider([ 0 as any ])).toThrow(DreamstateError);
    expect(() => createProvider([ "0" as any ])).toThrow(DreamstateError);
    expect(() => createProvider([ false as any ])).toThrow(DreamstateError);
    expect(() => createProvider([ {} as any ])).toThrow(DreamstateError);
    expect(() => createProvider([ new Function() as any ])).toThrow(DreamstateError);
    expect(() => createProvider([ [] as any ])).toThrow(DreamstateError);
    expect(() => createProvider([ class ExampleClass {} as any ])).toThrow(DreamstateError);
    expect(() => createProvider([])).toThrow();

    expect(() => createProvider([ TestManager ])).not.toThrow();

    expect(getCallableError<DreamstateError>(() => createProvider(null as any)).code).toBe(
      EDreamstateErrorCode.INCORRECT_PARAMETER
    );
    expect(getCallableError<DreamstateError>(() => createProvider([ null ] as any)).code).toBe(
      EDreamstateErrorCode.TARGET_CONTEXT_MANAGER_EXPECTED
    );
  });

  it("should create correct component tree without children", () => {
    const combinedTree = mount(
      <ScopeProvider>
        <CombinedProvider>
          <div> testChild </div>
        </CombinedProvider>
      </ScopeProvider>
    );
    const scopedTree = mount(
      <ScopeProvider>
        <ScopedProvider>
          <div> testChild </div>
        </ScopedProvider>
      </ScopeProvider>
    );

    expect(combinedTree.render()).toMatchSnapshot();
    expect(scopedTree.render()).toMatchSnapshot();
    expect(combinedTree).toMatchSnapshot();
    expect(scopedTree).toMatchSnapshot();
  });

  it("should have default provider names for production environment", () => {
    expect(createScopedProvider([ TestManager ]).displayName).toBeUndefined();
    expect(createCombinedProvider([ TestManager ]).displayName).toBeUndefined();
  });
});
