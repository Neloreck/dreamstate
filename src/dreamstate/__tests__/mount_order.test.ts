import { mount } from "enzyme";
import { createElement, FunctionComponent } from "react";

import { ContextManager, ScopeProvider } from "@/dreamstate";
import { createProvider } from "@/dreamstate/core/provision/createProvider";

describe("Mount order for providers", () => {
  const generateManagers = (mountList: Array<string>, unmountList: Array<string>) => {
    class BaseManager extends ContextManager {
      public onProvisionStarted(): void {
        mountList.push(this.constructor.name);
      }

      public onProvisionEnded(): void {
        unmountList.push(this.constructor.name);
      }
    }

    class First extends BaseManager {}

    class Second extends BaseManager {}

    class Third extends BaseManager {}

    return { First, Second, Third };
  };

  const mountProviderTree = (provider: FunctionComponent) =>
    mount(createElement(ScopeProvider, {}, createElement(provider)));

  const testProvider = (isCombined: boolean) => {
    const mountList: Array<string> = [];
    const unmountList: Array<string> = [];

    const { First, Second, Third } = generateManagers(mountList, unmountList);
    const Provider = createProvider([First, Second, Third], {
      isCombined,
    });

    const tree = mountProviderTree(Provider);

    expect(mountList).toHaveLength(3);
    expect(mountList[2]).toBe(First.name);
    expect(mountList[1]).toBe(Second.name);
    expect(mountList[0]).toBe(Third.name);
    expect(unmountList).toHaveLength(0);

    tree.unmount();

    expect(mountList).toHaveLength(3);
    expect(unmountList).toHaveLength(3);
    expect(unmountList[2]).toBe(Third.name);
    expect(unmountList[1]).toBe(Second.name);
    expect(unmountList[0]).toBe(First.name);
  };

  it("should properly mount combined provider components", async () => {
    testProvider(true);
  });

  it("should properly mount scoped provider components", async () => {
    testProvider(false);
  });
});
