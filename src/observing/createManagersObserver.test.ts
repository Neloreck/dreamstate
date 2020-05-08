import { createManagersObserver } from "./createManagersObserver";

import { TestContextWorker, TestContextManager } from "@Tests/assets";
import { mount } from "enzyme";
import { createElement, PropsWithChildren } from "react";

describe("shouldObserversUpdate method functionality.", () => {
  it("Should validate observer creation for context workers only.", () => {
    expect(() => createManagersObserver(null, undefined as any)).toThrow();
    expect(() => createManagersObserver(null, [ 1 as any ])).toThrow();
    expect(() => createManagersObserver(null, [ {} as any ])).toThrow();
    expect(() => createManagersObserver(null, [ null as any ])).toThrow();
    expect(() => createManagersObserver(null, [ "123" as any ])).toThrow();
    expect(() => createManagersObserver(null, [ true as any ])).toThrow();

    expect(() => createManagersObserver(null, [])).not.toThrow();
    expect(() => createManagersObserver(null, [ TestContextManager ])).not.toThrow();
    expect(() => createManagersObserver(null, [ TestContextWorker ])).not.toThrow();
    expect(() => createManagersObserver(null, [ TestContextWorker, TestContextManager ])).not.toThrow();
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
