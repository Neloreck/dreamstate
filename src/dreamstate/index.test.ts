describe("Library exported API", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const libRoot = require("./index");

  const expectedLibExports: Array<string> = [
    // Types.
    "Loadable",
    "Nested",
    "Computed",
    "StateSetter",
    "Consumable",
    "SignalEvent",
    "Signal",
    "SignalType",
    "QueryRequest",
    "QueryResponse",
    "OptionalQueryResponse",
    "QueryType",
    "ContextManagerConstructor",
    // Management.
    "ContextManager",
    // Provision.
    "createProvider",
    // Consumption.
    "useManager",
    // Signals.
    "OnSignal",
    "unsubscribeFromSignals",
    "subscribeToSignals",
    "useSignals",
    "emitSignal",
    // Queries.
    "OnQuery",
    "queryDataAsync",
    "queryDataSync",
    "registerQueryProvider",
    "unRegisterQueryProvider",
    // Utils.
    "createNested",
    "createComputed",
    "createLoadable",
    "createActions",
    "Bind"
  ];

  const assertListIntersection = (first: Array<string>, second: Array<string>) => {
    first.forEach((it: string) => {
      if (!second.includes(it)) {
        throw new Error("Item missing: " + it);
      }
    });
    second.forEach((it: string) => {
      if (!second.includes(it)) {
        throw new Error("Item missing: " + it);
      }
    });
  };

  it("Should export correct core API methods", () => {
    assertListIntersection(Object.keys(libRoot), expectedLibExports);
    expect(Object.keys(libRoot)).toHaveLength(expectedLibExports.length);
  });
});
