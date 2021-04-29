import { ContextManager } from "@/dreamstate";
import { CONTEXT_SERVICES_REFERENCES } from "@/dreamstate/core/internals";
import { startServiceObserving } from "@/dreamstate/core/observing/startServiceObserving";
import { registerService } from "@/dreamstate/core/registry/registerService";
import { unRegisterService } from "@/dreamstate/core/registry/unRegisterService";

describe("Start service observing method", () => {
  const spy = jest.fn();

  class ExampleManager extends ContextManager {

    protected onProvisionStarted() {
      spy();
    }

  }

  it("Should properly count references", () => {
    expect(CONTEXT_SERVICES_REFERENCES.get(ExampleManager)).toBeUndefined();

    registerService(ExampleManager);

    expect(CONTEXT_SERVICES_REFERENCES.get(ExampleManager)).toBe(0);
    expect(spy).toHaveBeenCalledTimes(0);

    CONTEXT_SERVICES_REFERENCES.set(ExampleManager, 10);
    startServiceObserving(ExampleManager);

    expect(CONTEXT_SERVICES_REFERENCES.get(ExampleManager)).toBe(11);
    expect(spy).toHaveBeenCalledTimes(0);

    CONTEXT_SERVICES_REFERENCES.set(ExampleManager, 0);
    startServiceObserving(ExampleManager);

    expect(CONTEXT_SERVICES_REFERENCES.get(ExampleManager)).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);

    unRegisterService(ExampleManager);
  });
});
