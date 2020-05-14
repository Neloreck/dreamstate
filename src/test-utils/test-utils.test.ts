describe("Library test utils exports.", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const testUtilsRoot = require("@Lib/test-utils/test-utils");

  const expectedTestUtilsExports: Array<string> = [
    "registerService",
    "unRegisterService",
    "addServiceObserver",
    "removeServiceObserver",
    "getServiceObserversCount",
    "isServiceProvided",
    "getReactProvider",
    "getReactConsumer",
    "nextAsyncQueue"
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

  it("Should export correct test-utils API methods", () => {
    assertListIntersection(Object.keys(testUtilsRoot), expectedTestUtilsExports);
    expect(Object.keys(testUtilsRoot)).toHaveLength(expectedTestUtilsExports.length);
  });
});
