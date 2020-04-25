describe("Library exported API tests.", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const libRoot = require("../src");

  const expectedExports: Array<string> = [
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
    // Registry.
    "subscribeToManager",
    "unsubscribeFromManager",
    "getCurrentContext",
    "getCurrentManager",
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

  it("Should export correct API methods", () => {
    Object.keys(libRoot).forEach((it: string) => expect(expectedExports.includes(it)).toBeTruthy());
    expect(Object.keys(libRoot)).toHaveLength(expectedExports.length);
  });

  it("Should not declare debug variables for production.", () => {
    // @ts-ignore
    expect(window.__DREAMSTATE_DEBUG_INTERNALS__).toBeUndefined();
    expect((global as any).IS_DEBUG).toBeFalsy();
  });
});
