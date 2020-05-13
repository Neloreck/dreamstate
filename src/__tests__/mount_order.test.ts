import { mount } from "enzyme";
import { createElement } from "react";

import { ContextService, createProvider, getCurrent } from "../";
import { registerService } from "../testing";
import { CONTEXT_SERVICES_ACTIVATED } from "../internals";

describe("Mount order for providers.", () => {
  class First extends ContextService {}

  class Second extends ContextService {}

  class Third extends ContextService {}

  const Provider = createProvider([ First, Second, Third ]);

  it("Should properly mount provided components.", async () => {
    const list: Array<string> = [];

    registerService(First)["onProvisionStarted"] = () => {
      expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(3);
      list.push(First.name);
    };
    registerService(Second)["onProvisionStarted"] = () => {
      expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(3);
      list.push(Second.name);
    };
    registerService(Third)["onProvisionStarted"] = () => {
      expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(3);
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
      expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(1);
      list.push(First.name);
    };
    getCurrent(Second)!["onProvisionEnded"] = () => {
      expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(2);
      list.push(Second.name);
    };
    getCurrent(Third)!["onProvisionEnded"] = () => {
      expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(3);
      list.push(Third.name);
    };

    tree.unmount();

    expect(list).toHaveLength(3);
    expect(list[0]).toBe(Third.name);
    expect(list[1]).toBe(Second.name);
    expect(list[2]).toBe(First.name);
  });
});
