describe("Library exported API tests.", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const libRoot = require("../index");

  const expectedExports: Array<string> = [
    // Types.
    "Loadable",
    "Mutable",
    "StateSetter",
    "Consumable",
    "SignalEvent",
    "Signal",
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
    "useSignal",
    // Utils.
    "createMutable",
    "createLoadable",
    "createSetter",
    "Bind",
  ];

  it("Should export correct API methods", () => {
    expect(expectedExports).toHaveLength(25);
    expect(Object.keys(libRoot)).toHaveLength(expectedExports.length);

    Object.keys(libRoot).forEach((it: string) => {
      expect(expectedExports.includes(it)).toBeTruthy();
    });
  });
});
