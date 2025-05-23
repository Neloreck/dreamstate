import { mount } from "enzyme";
import { createElement, FunctionComponent } from "react";

import { ContextManager, ScopeProvider } from "@/dreamstate";
import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { OnQuery } from "@/dreamstate/core/queries/OnQuery";
import { TAnyValue } from "@/dreamstate/types";

/**
 * Construction occurs before initial provision start.
 * So mounting order does not impact listening start/stop.
 */
describe("Sending query on provision start", () => {
  const count = jest.fn((value: TAnyValue) => {
    expect(value.type).toBe("START");
    expect(value.data).toBe("value");
  });

  class QueryingOnStart extends ContextManager {
    public onProvisionStarted(): void {
      count(this.queryDataSync({ type: "START" }));
    }
  }

  class AnsweringOnStart extends ContextManager {
    @OnQuery("START")
    private onQuery(): string {
      return "value";
    }
  }

  it("should properly query data while mounting", async () => {
    async function testProvider(provider: FunctionComponent, times: number): Promise<void> {
      const tree = mount(createElement(ScopeProvider, {}, createElement(provider, {})));

      tree.unmount();

      expect(count).toHaveBeenCalledTimes(times);

      count.mockClear();
    }

    await testProvider(createProvider([AnsweringOnStart, QueryingOnStart], { isCombined: true }), 1);
    await testProvider(createProvider([QueryingOnStart, AnsweringOnStart], { isCombined: true }), 1);
    await testProvider(
      createProvider([AnsweringOnStart, QueryingOnStart], {
        isCombined: false,
      }),
      1
    );
    await testProvider(
      createProvider([QueryingOnStart, AnsweringOnStart], {
        isCombined: false,
      }),
      1
    );
  });
});
