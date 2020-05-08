import { createManagersObserver } from "./createManagersObserver";

import { TestContextWorker, TestContextManager } from "@Tests/assets";
import { mount } from "enzyme";
import { createElement, PropsWithChildren } from "react";

describe("shouldObserversUpdate method functionality.", () => {
  it("Should create observers with validation.", () => {
    expect(() => createManagersObserver(null, 0 as any)).toThrow(TypeError);
    expect(() => createManagersObserver(null, "0" as any)).toThrow(TypeError);
    expect(() => createManagersObserver(null, false as any)).toThrow(TypeError);
    expect(() => createManagersObserver(null, null as any)).toThrow(TypeError);
    expect(() => createManagersObserver(null, null as any)).toThrow(TypeError);
    expect(() => createManagersObserver(null, [ null as any ])).toThrow(TypeError);
    expect(() => createManagersObserver(null, [ 0 as any ])).toThrow(TypeError);
    expect(() => createManagersObserver(null, [ "0" as any ])).toThrow(TypeError);
    expect(() => createManagersObserver(null, [ false as any ])).toThrow(TypeError);
    expect(() => createManagersObserver(null, [ {} as any ])).toThrow(TypeError);
    expect(() => createManagersObserver(null, [ new Function() as any ])).toThrow(TypeError);
    expect(() => createManagersObserver(null, [ [] as any ])).toThrow(TypeError);
    expect(() => createManagersObserver(null, [ class ExampleClass {} as any ])).toThrow(TypeError);

    expect(() => createManagersObserver(null, [])).not.toThrow();
    expect(() => createManagersObserver(null, [ TestContextManager, TestContextWorker ])).not.toThrow();
    expect(() => createManagersObserver(null, [ TestContextWorker ])).not.toThrow();
    expect(() => createManagersObserver(null, [ TestContextManager ])).not.toThrow();
  });
  it("Should create correct component tree without children.", () => {
    const el = createManagersObserver(null, [ TestContextManager, TestContextWorker ]);
    const tree = mount(createElement(el, {}, createElement("div", {}, "testChild")));

    expect(tree).toMatchSnapshot();
  });

  it("Should create correct component tree with children.", () => {
    const el = createManagersObserver(
      ({ children, ...rest }: PropsWithChildren<any>) => createElement("main", {}, [ JSON.stringify(rest), children ]),
      [ TestContextManager, TestContextWorker ]
    );
    const tree = mount(createElement(el, {}, createElement("div", {}, "testChild")));

    expect(tree).toMatchSnapshot();
  });
});
