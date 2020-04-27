describe("Library exported API tests.", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const libRoot = require("@Lib/index");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const testUtilsRoot = require("@Lib/test-utils");

  const expectedLibExports: Array<string> = [
    // Types.
    "Loadable",
    "Mutable",
    "StateSetter",
    "Consumable",
    "SignalEvent",
    "Signal",
    "SignalType",
    "QueryRequest",
    "QueryResponse",
    "QueryType",
    // Management.
    "ContextManager",
    "ContextWorker",
    // Registry.
    "getCurrentContext",
    "getCurrent",
    // Provision.
    "Provide",
    "withProvision",
    "createProvider",
    // Consumption.
    "Consume",
    "withConsumption",
    "useManager",
    // Signals.
    "OnSignal",
    "unsubscribeFromSignals",
    "subscribeToSignals",
    "useSignals",
    "emitSignal",
    // Queries.
    "OnQuery",
    // Utils.
    "createMutable",
    "createLoadable",
    "createSetter",
    "Bind"
  ];

  const expectedTestUtilsExports: Array<string> = [
    "registerWorkerClass",
    "unRegisterWorkerClass",
    "getWorkerObserversCount",
    "addManagerObserver",
    "removeManagerObserver",
    "nextAsyncQueue"
  ];

  it("Should export correct lib API methods", () => {
    Object.keys(libRoot).forEach((it: string) => expect(expectedLibExports.includes(it)).toBeTruthy());
    expect(Object.keys(libRoot)).toHaveLength(expectedLibExports.length);
  });

  it("Should export correct test-utils API methods", () => {
    Object.keys(testUtilsRoot).forEach((it: string) => expect(expectedTestUtilsExports.includes(it)).toBeTruthy());
    expect(Object.keys(testUtilsRoot)).toHaveLength(expectedTestUtilsExports.length);
  });

  it("Should not declare debug variables for production.", () => {
    // @ts-ignore
    expect(window.__DREAMSTATE_DEBUG_INTERNALS__).toBeUndefined();
    expect((global as any).IS_DEBUG).toBeFalsy();
  });
});
