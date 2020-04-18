describe("Library exported API test.", () => {
  const libRoot = require("../index");

  it("Should export ContextManager class.", () => {
    expect(libRoot.ContextManager).toBeDefined();
  });

  it("Should export provision methods.", () => {
    expect(libRoot.Provide).toBeDefined();
    expect(libRoot.withProvision).toBeDefined();
    expect(libRoot.createProvider).toBeDefined();
  });

  it("Should export consumption methods.", () => {
    expect(libRoot.Consume).toBeDefined();
    expect(libRoot.withConsumption).toBeDefined();
    expect(libRoot.useManager).toBeDefined();
  });

  it("Should export signals methods.", () => {
    expect(libRoot.Signal).toBeDefined();
    expect(libRoot.unsubscribeFromSignals).toBeDefined();
    expect(libRoot.subscribeToSignals).toBeDefined();
  });

  it("Should export utils.", () => {
    expect(libRoot.createMutable).toBeDefined();
    expect(libRoot.createLoadable).toBeDefined();
    expect(libRoot.Bind).toBeDefined();
  });

  it("Should export context subscription methods.", () => {
    expect(libRoot.subscribeToManager).toBeDefined();
    expect(libRoot.createLoadable).toBeDefined();
    expect(libRoot.unsubscribeFromManager).toBeDefined();
  });
});
