import { createElement, ReactElement } from "react";
import { mount } from "enzyme";

import { useLazyInitializeWorker } from "./useLazyInitializeWorker";
import { CONTEXT_OBSERVERS_REGISTRY, CONTEXT_WORKERS_REGISTRY } from "../internals";
import { unRegisterWorker } from "../testing";

import { TestContextWorker } from "@Tests/assets";

describe("useLazyInitializeWorker method functionality.", () => {
  it("Should correctly render functions and register workers.", () => {
    expect(CONTEXT_WORKERS_REGISTRY.has(TestContextWorker)).toBeFalsy();
    expect(CONTEXT_OBSERVERS_REGISTRY.has(TestContextWorker)).toBeFalsy();

    const withLazyInit = (): ReactElement => {
      useLazyInitializeWorker(TestContextWorker, jest.fn());

      return createElement("div", {}, 123);
    };

    const tree = mount(createElement(withLazyInit));

    expect(tree).toMatchSnapshot();

    expect(CONTEXT_WORKERS_REGISTRY.has(TestContextWorker)).toBeTruthy();
    expect(CONTEXT_OBSERVERS_REGISTRY.has(TestContextWorker)).toBeTruthy();
    expect(CONTEXT_OBSERVERS_REGISTRY.get(TestContextWorker)!.size).toBe(1);

    const currentWorker: TestContextWorker = CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)!;
    const nextTree = mount(createElement(withLazyInit));

    expect(currentWorker).toBe(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker));

    tree.unmount();
    nextTree.unmount();

    expect(CONTEXT_WORKERS_REGISTRY.get(TestContextWorker)).toBeUndefined();

    unRegisterWorker(TestContextWorker);
  });
});
