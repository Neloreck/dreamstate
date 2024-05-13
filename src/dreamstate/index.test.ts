import { DreamstateError, DreamstateErrorCode } from "@/dreamstate";

describe("Library exported API", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const libRoot = require("./index");

  const expectedLibExports: Array<string> = [
    // Types.
    "Computed",
    "ContextManagerConstructor",
    "DreamstateErrorCode",
    "Loadable",
    "ManagerInstanceMap",
    "ManagerMap",
    "Nested",
    "OptionalQueryResponse",
    "PartialTransformer",
    "QueryRequest",
    "QueryResponse",
    "QueryType",
    "Signal",
    "SignalEvent",
    "SignalType",
    // Error.
    "DreamstateError",
    // Management.
    "ContextManager",
    // Provision.
    "createProvider",
    "ProviderProps",
    // Scoping
    "ScopeContext",
    "ScopeProvider",
    "useScope",
    // Consumption.
    "useManager",
    // Signals.
    "OnSignal",
    // Queries.
    "OnQuery",
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
        throw new DreamstateError(DreamstateErrorCode.UNEXPECTED_ERROR, "Item missing: " + it);
      }
    });
    second.forEach((it: string) => {
      if (!second.includes(it)) {
        throw new DreamstateError(DreamstateErrorCode.UNEXPECTED_ERROR, "Item missing: " + it);
      }
    });
  };

  it("should export correct core API methods", () => {
    assertListIntersection(Object.keys(libRoot), expectedLibExports);
    expect(Object.keys(libRoot)).toHaveLength(expectedLibExports.length);
  });
});
