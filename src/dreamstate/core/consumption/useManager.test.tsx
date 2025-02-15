import { mount } from "enzyme";
import { default as React, ReactElement } from "react";
import { act } from "react-dom/test-utils";

import { ContextManager, createProvider, ScopeProvider, useManager, useScope } from "@/dreamstate";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { TUninitializedValue } from "@/dreamstate/types";

describe("useManager subscription and rendering", () => {
  const onStarted = jest.fn();
  const onEnded = jest.fn();

  interface ISampleContext {
    example: number;
    text: string;
  }

  class SampleContextManager extends ContextManager<ISampleContext> {
    public context: ISampleContext = {
      example: 1000,
      text: "value",
    };

    public onProvisionStarted(): void {
      onStarted();
    }

    public onProvisionEnded(): void {
      onEnded();
    }
  }

  const CombinedProvider = createProvider([SampleContextManager], { isCombined: true });
  const ScopedProvider = createProvider([SampleContextManager], { isCombined: false });

  afterEach(() => {
    onEnded.mockClear();
    onStarted.mockClear();
  });

  it("should properly fire provision events for functional subscribers and clean-up memory (combined)", async () => {
    let rendersCount: number = 0;
    let stateScope: IScopeContext = null as TUninitializedValue;

    function SampleConsumer(): ReactElement {
      const scope: IScopeContext = useScope();
      const value: ISampleContext = useManager(SampleContextManager);

      rendersCount += 1;
      stateScope = scope;

      return <span>{JSON.stringify(value)}</span>;
    }

    const tree = mount(
      <ScopeProvider>
        <CombinedProvider>
          <SampleConsumer/>
        </CombinedProvider>
      </ScopeProvider>
    );

    expect(tree.render()).toMatchSnapshot();

    expect(onStarted).toHaveBeenCalledTimes(1);
    expect(onEnded).toHaveBeenCalledTimes(0);
    expect(stateScope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY.get(SampleContextManager)).toBeDefined();
    expect(stateScope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)).toBeDefined();

    act(() => {
      stateScope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)!.setContext({ example: -1 });
    });
    tree.update();

    expect(tree).toMatchSnapshot();
    expect(rendersCount).toBe(2);

    act(() => {
      stateScope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)!.setContext({
        text: "anything",
      });
    });
    tree.update();

    expect(tree).toMatchSnapshot();
    expect(rendersCount).toBe(3);

    tree.unmount();

    expect(onStarted).toHaveBeenCalledTimes(1);
    expect(onEnded).toHaveBeenCalledTimes(1);
    expect(rendersCount).toBe(3);

    expect(stateScope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY.get(SampleContextManager)).toBeUndefined();
    expect(stateScope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)).toBeUndefined();
  });

  it("should properly handle memoized subscriptions (combined)", async () => {
    let rendersCount: number = 0;
    let stateScope: IScopeContext = null as TUninitializedValue;

    function SampleConsumer(): ReactElement {
      const scope: IScopeContext = useScope();
      const value: ISampleContext = useManager(SampleContextManager, ({ text }) => [text]);

      rendersCount += 1;
      stateScope = scope;

      return <span>{JSON.stringify(value)}</span>;
    }

    const tree = mount(
      <ScopeProvider>
        <CombinedProvider>
          <SampleConsumer/>
        </CombinedProvider>
      </ScopeProvider>
    );

    expect(tree.render()).toMatchSnapshot();

    act(() => {
      stateScope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)!.setContext({ example: -1 });
    });
    tree.update();

    expect(tree).toMatchSnapshot();
    expect(rendersCount).toBe(1);

    act(() => {
      stateScope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)!.setContext({
        text: "anything",
      });
    });
    tree.update();

    expect(tree).toMatchSnapshot();
    expect(rendersCount).toBe(2);

    tree.unmount();

    expect(rendersCount).toBe(2);
  });

  it("should properly fire provision events for functional subscribers and clean-up memory (scoped)", async () => {
    let rendersCount: number = 0;
    let stateScope: IScopeContext = null as TUninitializedValue;

    function SampleConsumer(): ReactElement {
      const scope: IScopeContext = useScope();
      const value: ISampleContext = useManager(SampleContextManager);

      rendersCount += 1;
      stateScope = scope;

      return <span>{JSON.stringify(value)}</span>;
    }

    const tree = mount(
      <ScopeProvider>
        <ScopedProvider>
          <SampleConsumer/>
        </ScopedProvider>
      </ScopeProvider>
    );

    expect(tree.render()).toMatchSnapshot();

    expect(onStarted).toHaveBeenCalledTimes(1);
    expect(onEnded).toHaveBeenCalledTimes(0);
    expect(stateScope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY.get(SampleContextManager)).toBeDefined();
    expect(stateScope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)).toBeDefined();

    act(() => {
      stateScope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)!.setContext({ example: -1 });
    });
    tree.update();

    expect(tree).toMatchSnapshot();
    expect(rendersCount).toBe(2);

    act(() => {
      stateScope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)!.setContext({
        text: "anything",
      });
    });
    tree.update();

    expect(tree).toMatchSnapshot();
    expect(rendersCount).toBe(3);

    tree.unmount();

    expect(onStarted).toHaveBeenCalledTimes(1);
    expect(onEnded).toHaveBeenCalledTimes(1);
    expect(rendersCount).toBe(3);

    expect(stateScope.INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY.get(SampleContextManager)).toBeUndefined();
    expect(stateScope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)).toBeUndefined();
  });

  it("should properly handle memoized subscriptions (scoped)", async () => {
    let rendersCount: number = 0;
    let stateScope: IScopeContext = null as TUninitializedValue;

    function SampleConsumer(): ReactElement {
      const scope: IScopeContext = useScope();
      const value: ISampleContext = useManager(SampleContextManager, ({ text }) => [text]);

      rendersCount += 1;
      stateScope = scope;

      return <span>{JSON.stringify(value)}</span>;
    }

    const tree = mount(
      <ScopeProvider>
        <ScopedProvider>
          <SampleConsumer/>
        </ScopedProvider>
      </ScopeProvider>
    );

    expect(tree.render()).toMatchSnapshot();

    act(() => {
      stateScope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)!.setContext({ example: -1 });
    });
    tree.update();

    expect(tree).toMatchSnapshot();
    expect(rendersCount).toBe(1);

    act(() => {
      stateScope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)!.setContext({
        text: "anything",
      });
    });
    tree.update();

    expect(tree).toMatchSnapshot();
    expect(rendersCount).toBe(2);

    tree.unmount();

    expect(rendersCount).toBe(2);
  });
});
