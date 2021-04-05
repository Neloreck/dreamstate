import { promisifyQuery } from "@/dreamstate/core/queries/promisifyQuery";

describe("promisifyQuery method", () => {
  it("Should properly call sync methods", async () => {
    const service = {
      testMethod(it: any): any {
        return it;
      }
    };

    const data = 1000;

    const result = await promisifyQuery(service.testMethod, data as any, null);

    expect(result!.data).toBe(data);
    expect(result!.answerer).toBe(service.testMethod);
  });

  it("Should properly call async methods", async () => {
    const service = {
      async testMethod(it: any): Promise<any> {
        return it;
      }
    };

    const data = 1000;

    const result = await promisifyQuery(service.testMethod, data as any, null);

    expect(result!.data).toBe(data);
    expect(result!.answerer).toBe(service.testMethod);
  });

  it("Should properly handle sync exceptions", async () => {
    const service = {
      testMethod(): void {
        throw new Error();
      }
    };

    expect(promisifyQuery(service.testMethod.bind(service), 123 as any, null)).rejects.toBeInstanceOf(Error);
  });

  it("Should properly handle async exceptions", async () => {
    const service = {
      async testMethod(): Promise<void> {
        throw new Error();
      }
    };

    expect(promisifyQuery(service.testMethod.bind(service), 123 as any, null)).rejects.toBeInstanceOf(Error);
  });
});
