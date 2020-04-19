describe("Library exported API test.", () => {
  const libRoot = require("../src");

  const expectedExports: Array<string> = [
    // Types.
    "ILoadable",
    "TLoadable",
    "TMutable",
    "TStateSetter",
    "TConsumable",
    "ISignal",
    "IBaseSignal",
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
    "Signal",
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
    expect(expectedExports).toHaveLength(26);
    expect(Object.keys(libRoot)).toHaveLength(expectedExports.length);

    Object.keys(libRoot).forEach((it: string) => {
      expect(expectedExports.includes(it)).toBeTruthy();
    });
  });
});
