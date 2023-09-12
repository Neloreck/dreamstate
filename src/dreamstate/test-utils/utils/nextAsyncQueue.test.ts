import { nextAsyncQueue } from "@/dreamstate/test-utils/utils/nextAsyncQueue";

describe("Async queue await util", () => {
  it("should properly return promise", () => {
    expect(typeof nextAsyncQueue()).toBe("object");
    expect(nextAsyncQueue() instanceof Promise).toBeTruthy();
  });

  it("should not throw", () => {
    expect(nextAsyncQueue()).resolves.toBeUndefined();
  });

  it("should execute as next in queue", async () => {
    let value = 0;

    nextAsyncQueue().then(() => (value = 10));

    expect(value).toBe(0);

    await new Promise((resolve) => setTimeout(resolve));

    expect(value).toBe(10);
  });

  it("should execute as next with delay", async () => {
    let value = 0;

    nextAsyncQueue(250).then(() => (value = 10));

    expect(value).toBe(0);

    await new Promise((resolve) => setTimeout(resolve, 251));

    expect(value).toBe(10);

    nextAsyncQueue(250).then(() => (value = -1));

    expect(value).toBe(10);

    await new Promise((resolve) => setTimeout(resolve, 240));

    expect(value).toBe(10);
  });
});
