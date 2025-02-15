import { DreamstateError, DreamstateErrorCode } from "@/dreamstate";

describe("Library test utils exports", () => {
  const testUtilsRoot = require("./test-utils");

  const expectedTestUtilsExports: Array<string> = [
    "getReactProvider",
    "getReactConsumer",
    "getCurrent",
    "mockManager",
    "mockManagers",
    "mockContextProvider",
    "mockScopeProvider",
    "mockRegistry",
    "mockManagerInitialContext",
    "mockScope",
    "nextAsyncQueue",
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

  it("should export correct test-utils API methods", () => {
    assertListIntersection(Object.keys(testUtilsRoot), expectedTestUtilsExports);
    expect(Object.keys(testUtilsRoot)).toHaveLength(expectedTestUtilsExports.length);
  });
});
