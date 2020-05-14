import { promisifyQuery } from "@Lib/queries/promisifyQuery";

describe("promisifyQuery method.", () => {
  it("Should properly call sync methods.", async () => {
    const service = {
      testMethod(it: any): any {
        return it;
      }
    };

    const data = 1000;

    const result = await promisifyQuery(service as any, "testMethod", data as any);

    expect(result!.data).toBe(data);
  });

  it("Should properly call async methods.", async () => {
    const service = {
      async testMethod(it: any): Promise<any> {
        return it;
      }
    };

    const data = 1000;

    const result = await promisifyQuery(service as any, "testMethod", data as any);

    expect(result!.data).toBe(data);
  });

  it("Should properly handle sync exceptions.", async () => {
    const service = {
      testMethod(): void {
        throw new Error();
      }
    };

    expect(promisifyQuery(service as any, "testMethod", 123 as any)).rejects.toBeInstanceOf(Error);
  });

  it("Should properly handle async exceptions.", async () => {
    const service = {
      async testMethod(): Promise<void> {
        throw new Error();
      }
    };

    expect(promisifyQuery(service as any, "testMethod", 123 as any)).rejects.toBeInstanceOf(Error);
  });
});
