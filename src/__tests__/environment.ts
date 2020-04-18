declare const IS_DEV: boolean;

describe("Context testing environment.", () => {
  it("Environment should not be in dev mode.", () => {
    expect(IS_DEV).toBeFalsy();
  });
});
