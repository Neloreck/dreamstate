import { mockManagerInitialContext } from "@/dreamstate/test-utils/registry/mockManagerInitialContext";
import { TestManager } from "@/fixtures";

describe("mockManagerInitialContext test util", () => {
  it("Should create tuple for map initialization", () => {
    const [ manager, overrodeContext ] = mockManagerInitialContext(TestManager, { third: true });

    expect(mockManagerInitialContext(TestManager, {})).toHaveLength(2);
    expect(manager).toBe(TestManager);
    expect(overrodeContext).toStrictEqual({ third: true });
  });
});
