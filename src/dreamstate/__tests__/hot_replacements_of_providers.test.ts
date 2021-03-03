import { mount } from "enzyme";
import { createElement, ReactElement } from "react";

import { ContextManager, createProvider } from "@/dreamstate";
import { CONTEXT_SERVICES_ACTIVATED } from "@/dreamstate/core/internals";
import { TAnyObject, TDreamstateService } from "@/dreamstate/types";

describe("Mount order for providers", () => {
  it("Should correctly replace context managers", async () => {
    let provisionsStarted: number = 0;
    let provisionsEnded: number = 0;

    let firstProvided: number = 0;
    let firstRemoved: number = 0;
    let fourthProvided: number = 0;
    let fourthRemoved: number = 0;

    class Base extends ContextManager<TAnyObject> {

      public context: TAnyObject = {};

      protected onProvisionStarted() {
        provisionsStarted += 1;
      }

      protected onProvisionEnded() {
        provisionsEnded += 1;
      }

    }

    class First extends Base {

      protected onProvisionStarted() {
        super.onProvisionStarted();
        firstProvided += 1;
      }

      protected onProvisionEnded() {
        super.onProvisionEnded();
        firstRemoved += 1;
      }

    }

    class Second extends Base {}

    class Third extends Base {}

    class Fourth extends Base {

      protected onProvisionStarted() {
        super.onProvisionStarted();
        fourthProvided += 1;
      }

      protected onProvisionEnded() {
        super.onProvisionEnded();
        fourthRemoved += 1;
      }

    }

    let sources = [ First, Second, Third ];

    function RootProvisioner({ sources }: { sources: Array<TDreamstateService> }): ReactElement {
      const provider = createProvider(sources);

      return createElement(provider, {}, createElement("div", {}, "nested"));
    }

    const node = mount(createElement(RootProvisioner, { sources }));

    expect(node).toMatchSnapshot("Provider tree");
    expect(provisionsStarted).toBe(3);
    expect(provisionsEnded).toBe(0);
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(3);
    expect(CONTEXT_SERVICES_ACTIVATED.has(First)).toBeTruthy();

    node.setProps({ sources });

    expect(provisionsStarted).toBe(6);
    expect(provisionsEnded).toBe(3);
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(3);
    expect(CONTEXT_SERVICES_ACTIVATED.has(First)).toBeTruthy();

    sources = [ ...sources ];
    sources[0] = Fourth;

    node.setProps({ sources });

    expect(provisionsStarted).toBe(9);
    expect(provisionsEnded).toBe(6);
    expect(CONTEXT_SERVICES_ACTIVATED.size).toBe(3);
    expect(CONTEXT_SERVICES_ACTIVATED.has(First)).toBeFalsy();
    expect(CONTEXT_SERVICES_ACTIVATED.has(Fourth)).toBeTruthy();

    expect(firstProvided).toBe(2);
    expect(firstRemoved).toBe(2);
    expect(fourthProvided).toBe(1);
    expect(fourthRemoved).toBe(0);
  });
});
