import { ContextManager } from "@/dreamstate";
import { CONTEXT_SERVICES_REFERENCES } from "@/dreamstate/core/internals";
import { stopServiceObserving } from "@/dreamstate/core/observing/stopServiceObserving";
import { registerService } from "@/dreamstate/core/registry/registerService";
import { unRegisterService } from "@/dreamstate/core/registry/unRegisterService";

describe("Stop service observing method", () => {
  const spy = jest.fn();

  class ExampleManager extends ContextManager {

    protected onProvisionEnded() {
      spy();
    }

  }

  it("Should properly count references", () => {
    expect(CONTEXT_SERVICES_REFERENCES.get(ExampleManager)).toBeUndefined();

    registerService(ExampleManager);

    expect(CONTEXT_SERVICES_REFERENCES.get(ExampleManager)).toBe(0);
    expect(spy).toHaveBeenCalledTimes(0);

    CONTEXT_SERVICES_REFERENCES.set(ExampleManager, 5);
    stopServiceObserving(ExampleManager);

    expect(CONTEXT_SERVICES_REFERENCES.get(ExampleManager)).toBe(4);
    expect(spy).toHaveBeenCalledTimes(0);

    CONTEXT_SERVICES_REFERENCES.set(ExampleManager, 1);
    stopServiceObserving(ExampleManager);

    expect(CONTEXT_SERVICES_REFERENCES.get(ExampleManager)).toBe(0);
    expect(spy).toHaveBeenCalledTimes(1);

    unRegisterService(ExampleManager);
  });
});
