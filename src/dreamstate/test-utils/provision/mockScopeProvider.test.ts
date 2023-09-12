import { ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { mockScopeProvider } from "@/dreamstate/test-utils/provision/mockScopeProvider";

describe("mockScopeProvider test util", () => {
  it("should correctly return react provider class", () => {
    expect(mockScopeProvider()).toBe(ScopeContext.Provider);
  });
});
