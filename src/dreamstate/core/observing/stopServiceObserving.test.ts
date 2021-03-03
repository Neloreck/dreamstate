import { ContextService } from "@/dreamstate";
import { CONTEXT_SERVICES_REFERENCES } from "@/dreamstate/core/internals";
import { stopServiceObserving } from "@/dreamstate/core/observing/stopServiceObserving";
import { registerService } from "@/dreamstate/core/registry/registerService";
import { unRegisterService } from "@/dreamstate/core/registry/unRegisterService";

describe("Stop service observing method", () => {
  const spy = jest.fn();

  class ExampleService extends ContextService {

    protected onProvisionEnded() {
      spy();
    }

  }

  it("Should properly count references", () => {
    expect(CONTEXT_SERVICES_REFERENCES.get(ExampleService)).toBeUndefined();

    registerService(ExampleService);

    expect(CONTEXT_SERVICES_REFERENCES.get(ExampleService)).toBe(0);
    expect(spy).toHaveBeenCalledTimes(0);

    CONTEXT_SERVICES_REFERENCES.set(ExampleService, 5);
    stopServiceObserving(ExampleService);

    expect(CONTEXT_SERVICES_REFERENCES.get(ExampleService)).toBe(4);
    expect(spy).toHaveBeenCalledTimes(0);

    CONTEXT_SERVICES_REFERENCES.set(ExampleService, 1);
    stopServiceObserving(ExampleService);

    expect(CONTEXT_SERVICES_REFERENCES.get(ExampleService)).toBe(0);
    expect(spy).toHaveBeenCalledTimes(1);

    unRegisterService(ExampleService);
  });
});
