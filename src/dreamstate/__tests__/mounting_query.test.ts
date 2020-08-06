import { mount } from "enzyme";
import { createElement } from "react";

import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { OnQuery } from "@/dreamstate/core/queries/OnQuery";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";

/**
 * Construction occurs before initial provision start.
 * So mounting order does not impact listening start/stop.
 */
describe("Sending query on provision start.", () => {
  const count = jest.fn((value: any) => {
    expect(value.type).toBe("START");
    expect(value.data).toBe("value");
  });

  class QueryingOnProvisionStart extends ContextService {

    protected async onProvisionStarted() {
      count(await this.queryData({ type: "START" }));
    }

  }

  class AnsweringOnProvisionStart extends ContextService {

    @OnQuery("START")
    private onQuery(): string {
      return "value";
    }

  }

  const FirstProvider = createProvider([ AnsweringOnProvisionStart, QueryingOnProvisionStart ]);
  const SecondProvider = createProvider([ QueryingOnProvisionStart, AnsweringOnProvisionStart ]);

  it("Should properly query data while mounting.", async () => {
    const firstTree = mount(createElement(FirstProvider, {}));

    await nextAsyncQueue();

    expect(count).toHaveBeenCalledTimes(1);

    firstTree.unmount();

    const secondTree = mount(createElement(SecondProvider, {}));

    await nextAsyncQueue();

    expect(count).toHaveBeenCalledTimes(2);

    secondTree.unmount();
  });
});
