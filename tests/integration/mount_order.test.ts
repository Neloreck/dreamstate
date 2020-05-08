import { mount } from "enzyme";
import { createElement } from "react";

import { ContextWorker, createProvider, getCurrent } from "@Lib";
import { registerWorker } from "@Lib/testing";
import { CONTEXT_WORKERS_ACTIVATED } from "@Lib/internals";

describe("Mount order for providers.", () => {
  class First extends ContextWorker {}
  class Second extends ContextWorker {}
  class Third extends ContextWorker {}

  const Provider = createProvider([ First, Second, Third ]);

  it("Should properly mount provided components.", async () => {
    const list: Array<string> = [];

    registerWorker(First)["onProvisionStarted"] = () => {
      expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(3);
      list.push(First.name);
    };
    registerWorker(Second)["onProvisionStarted"] = () => {
      expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(3);
      list.push(Second.name);
    };
    registerWorker(Third)["onProvisionStarted"] = () => {
      expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(3);
      list.push(Third.name);
    };

    const tree = mount(createElement(Provider, {}));

    tree.unmount();

    expect(list).toHaveLength(3);
    expect(list[0]).toBe(First.name);
    expect(list[1]).toBe(Second.name);
    expect(list[2]).toBe(Third.name);
  });

  it("Should properly unmount provided components.", async () => {
    const list: Array<string> = [];
    const tree = mount(createElement(Provider, {}));

    getCurrent(First)!["onProvisionEnded"] = () => {
      expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(1);
      list.push(First.name);
    };
    getCurrent(Second)!["onProvisionEnded"] = () => {
      expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(2);
      list.push(Second.name);
    };
    getCurrent(Third)!["onProvisionEnded"] = () => {
      expect(CONTEXT_WORKERS_ACTIVATED.size).toBe(3);
      list.push(Third.name);
    };

    tree.unmount();

    expect(list).toHaveLength(3);
    expect(list[0]).toBe(Third.name);
    expect(list[1]).toBe(Second.name);
    expect(list[2]).toBe(First.name);
  });
});
