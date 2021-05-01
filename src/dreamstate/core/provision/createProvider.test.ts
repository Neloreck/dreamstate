import { mount, render } from "enzyme";
import { createElement } from "react";

import { CONTEXT_SERVICES_ACTIVATED } from "@/dreamstate/core/internals";
import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { TestContextManager } from "@/fixtures";

describe("createProvider method", () => {
  const CombinedProvider = createProvider([ TestContextManager ], { isCombined: true });
  const ScopedProvider = createProvider([ TestContextManager ], { isCombined: false });

  it("Should render correct component tree", async () => {
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeFalsy();

    const combinedTree = mount(createElement(CombinedProvider, {}, "test"));

    expect(combinedTree).toMatchSnapshot();
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeTruthy();

    combinedTree.unmount();

    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeFalsy();

    const scopedTree = mount(createElement(ScopedProvider, {}, "test"));

    expect(scopedTree).toMatchSnapshot();
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeTruthy();

    scopedTree.unmount();

    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeFalsy();
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

    expect(() => createProvider([])).not.toThrow();
    expect(() => createProvider([ TestContextManager ])).not.toThrow();
  });

  it("Should create correct component tree without children", () => {
    const combinedProvider = createProvider([ TestContextManager ], { isCombined: true });
    const scopedProvider = createProvider([ TestContextManager ], { isCombined: false });

    const combinedTree = mount(createElement(combinedProvider, {}, createElement("div", {}, "testChild")));
    const scopedTree = mount(createElement(scopedProvider, {}, createElement("div", {}, "testChild")));

    const combinedRender = render(createElement(combinedProvider, {}, createElement("div", {}, "testChild")));
    const scopedRender = render(createElement(combinedProvider, {}, createElement("div", {}, "testChild")));

    expect(combinedTree).toMatchSnapshot();
    expect(scopedTree).toMatchSnapshot();
    expect(combinedRender).toMatchSnapshot();
    expect(scopedRender).toMatchSnapshot();
    expect(combinedRender).toMatchObject(scopedRender);
  });
});
