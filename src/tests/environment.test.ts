declare const IS_DEV: boolean;

describe("Context testing environment.", () => {
  it("Environment should not be in prod mode.", () => {
    expect(IS_DEV).toBeFalsy();
  });
});
