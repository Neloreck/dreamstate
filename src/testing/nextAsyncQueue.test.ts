import { nextAsyncQueue } from "./nextAsyncQueue";

describe("Async queue await util.", () => {
  it("Should properly return promise.", () => {
    expect(typeof nextAsyncQueue()).toBe("object");
    expect((nextAsyncQueue()) instanceof Promise).toBeTruthy();
  });

  it("Should not throw.", () => {
    expect(nextAsyncQueue()).resolves.toBeUndefined();
  });

  it("Should execute as next in queue.", async () => {
    let value = 0;

    nextAsyncQueue().then(() => value = 10);

    expect(value).toBe(0);

    await new Promise((resolve) => setTimeout(resolve));

    expect(value).toBe(10);
  });
});
