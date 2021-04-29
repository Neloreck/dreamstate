import { mount } from "enzyme";
import { createElement } from "react";

import { CONTEXT_SERVICES_ACTIVATED } from "@/dreamstate/core/internals";
import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { TestContextManager, TestContextService, TestSingleContextService } from "@/fixtures";

describe("createProvider method", () => {
  const Provider = createProvider([ TestContextManager, TestContextService, TestSingleContextService ]);

  it("Should render correct component tree", async () => {
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextService)).toBeFalsy();
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeFalsy();
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestSingleContextService)).toBeFalsy();

    const tree = mount(createElement(Provider, {}, "test"));

    expect(tree).toMatchSnapshot();

    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextService)).toBeTruthy();
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeTruthy();
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestSingleContextService)).toBeTruthy();

    tree.unmount();

    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextService)).toBeFalsy();
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestContextManager)).toBeFalsy();
    expect(CONTEXT_SERVICES_ACTIVATED.has(TestSingleContextService)).toBeTruthy();
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
    expect(() => createProvider([ TestContextManager, TestContextService ])).not.toThrow();
    expect(() => createProvider([ TestContextService ])).not.toThrow();
    expect(() => createProvider([ TestContextManager ])).not.toThrow();
  });
  it("Should create correct component tree without children", () => {
    const el = createProvider([ TestContextManager, TestContextService ]);
    const tree = mount(createElement(el, {}, createElement("div", {}, "testChild")));

    expect(tree).toMatchSnapshot();
  });
});
