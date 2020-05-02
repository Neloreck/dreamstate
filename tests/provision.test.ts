import { createManagersObserver } from "@Lib/observing";

import { TestContextWorker, TestContextManager } from "@Tests/assets";

describe("Provision utils and methods.", () => {
  it("Should create providers with validation.", () => {
    expect(() => createManagersObserver(null, 0 as any)).toThrow(TypeError);
    expect(() => createManagersObserver(null, "0" as any)).toThrow(TypeError);
    expect(() => createManagersObserver(null, false as any)).toThrow(TypeError);
    expect(() => createManagersObserver(null, null as any)).toThrow(TypeError);
    expect(() => createManagersObserver(null, null as any)).toThrow(TypeError);
    expect(() => createManagersObserver(null, [ null as any ])).toThrow(TypeError);
    expect(() => createManagersObserver(null, [ 0 as any ])).toThrow(TypeError);
    expect(() => createManagersObserver(null, [ "0" as any ])).toThrow(TypeError);
    expect(() => createManagersObserver(null, [ false as any ])).toThrow(TypeError);
    expect(() => createManagersObserver(null, [ {} as any ])).toThrow(TypeError);
    expect(() => createManagersObserver(null, [ new Function() as any ])).toThrow(TypeError);
    expect(() => createManagersObserver(null, [ [] as any ])).toThrow(TypeError);
    expect(() => createManagersObserver(null, [ class ExampleClass {} as any ])).toThrow(TypeError);

    expect(() => createManagersObserver(null, [])).not.toThrow();
    expect(() => createManagersObserver(null, [ TestContextManager, TestContextWorker ])).not.toThrow();
    expect(() => createManagersObserver(null, [ TestContextWorker ])).not.toThrow();
    expect(() => createManagersObserver(null, [ TestContextManager ])).not.toThrow();
  });
});
