import { mount } from "enzyme";
import React, { ReactElement } from "react";
import { act } from "react-dom/test-utils";

import { ContextManager, createProvider, ScopeProvider, useManager, useScope } from "@/dreamstate";
import { IPublicScopeContext, IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";

describe("UseManager subscription and rendering", () => {
  const onStarted = jest.fn();
  const onEnded = jest.fn();

  interface ISampleContext {
    example: number;
    text: string;
  }

  class SampleContextManager extends ContextManager<ISampleContext> {

    public context: ISampleContext = {
      example: 1000,
      text: "value"
    }

    protected onProvisionStarted(): void {
      onStarted();
    }

    protected onProvisionEnded(): void {
      onEnded();
    }

  }

  const SampleProvider = createProvider([ SampleContextManager ]);

  afterEach(() => {
    onEnded.mockClear();
    onStarted.mockClear();
  });

  it("Should properly fire provision events for functional subscribers and clean-up memory", async () => {
    let rendersCount: number = 0;
    let stateScope: IScopeContext = null as any;

    function SampleConsumer(): ReactElement {
      const scope: IPublicScopeContext = useScope();
      const value: ISampleContext = useManager(SampleContextManager);

      rendersCount += 1;
      stateScope = scope as IScopeContext;

      return <span> { JSON.stringify(value) } </span>;
    }

    const tree = mount(
      <ScopeProvider>
        <SampleProvider>
          <SampleConsumer/>
        </SampleProvider>
      </ScopeProvider>
    );

    expect(tree.render()).toMatchSnapshot();

    await nextAsyncQueue();

    expect(onStarted).toHaveBeenCalledTimes(1);
    expect(onEnded).toHaveBeenCalledTimes(0);
    expect(stateScope.REGISTRY.CONTEXT_STATES_REGISTRY.get(SampleContextManager)).toBeDefined();
    expect(stateScope.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)).toBeDefined();

    act(() => {
      stateScope.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)!.setContext({ example: -1 });
    });
    tree.update();

    expect(tree).toMatchSnapshot();
    expect(rendersCount).toBe(2);

    act(() => {
      stateScope.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)!.setContext({ text: "anything" });
    });
    tree.update();

    expect(tree).toMatchSnapshot();
    expect(rendersCount).toBe(3);

    tree.unmount();
    await nextAsyncQueue();

    expect(onStarted).toHaveBeenCalledTimes(1);
    expect(onEnded).toHaveBeenCalledTimes(1);
    expect(rendersCount).toBe(3);

    expect(stateScope.REGISTRY.CONTEXT_STATES_REGISTRY.get(SampleContextManager)).toBeUndefined();
    expect(stateScope.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)).toBeUndefined();
  });

  it("Should properly handle memoized subscriptions", async () => {
    let rendersCount: number = 0;
    let stateScope: IScopeContext = null as any;

    function SampleConsumer(): ReactElement {
      const scope: IPublicScopeContext = useScope();
      const value: ISampleContext = useManager(SampleContextManager, ({ text }) => [ text ]);

      rendersCount += 1;
      stateScope = scope as IScopeContext;

      return <span> { JSON.stringify(value) } </span>;
    }

    const tree = mount(
      <ScopeProvider>
        <SampleProvider>
          <SampleConsumer/>
        </SampleProvider>
      </ScopeProvider>
    );

    expect(tree.render()).toMatchSnapshot();

    await nextAsyncQueue();

    act(() => {
      stateScope.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)!.setContext({ example: -1 });
    });
    tree.update();

    expect(tree).toMatchSnapshot();
    expect(rendersCount).toBe(1);

    act(() => {
      stateScope.REGISTRY.CONTEXT_INSTANCES_REGISTRY.get(SampleContextManager)!.setContext({ text: "anything" });
    });
    tree.update();

    expect(tree).toMatchSnapshot();
    expect(rendersCount).toBe(2);

    tree.unmount();
    await nextAsyncQueue();

    expect(rendersCount).toBe(2);
  });
});
