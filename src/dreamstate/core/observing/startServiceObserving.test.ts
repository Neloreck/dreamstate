import { ContextService } from "@/dreamstate";
import { CONTEXT_SERVICES_REFERENCES } from "@/dreamstate/core/internals";
import { startServiceObserving } from "@/dreamstate/core/observing/startServiceObserving";
import { registerService } from "@/dreamstate/core/registry/registerService";
import { unRegisterService } from "@/dreamstate/core/registry/unRegisterService";

describe("Start service observing method", () => {
  const spy = jest.fn();

  class ExampleService extends ContextService {

    protected onProvisionStarted() {
      spy();
    }

  }

  it("Should properly count references", () => {
    expect(CONTEXT_SERVICES_REFERENCES.get(ExampleService)).toBeUndefined();

    registerService(ExampleService);

    expect(CONTEXT_SERVICES_REFERENCES.get(ExampleService)).toBe(0);
    expect(spy).toHaveBeenCalledTimes(0);

    CONTEXT_SERVICES_REFERENCES.set(ExampleService, 10);
    startServiceObserving(ExampleService);

    expect(CONTEXT_SERVICES_REFERENCES.get(ExampleService)).toBe(11);
    expect(spy).toHaveBeenCalledTimes(0);

    CONTEXT_SERVICES_REFERENCES.set(ExampleService, 0);
    startServiceObserving(ExampleService);

    expect(CONTEXT_SERVICES_REFERENCES.get(ExampleService)).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);

    unRegisterService(ExampleService);
  });
});
