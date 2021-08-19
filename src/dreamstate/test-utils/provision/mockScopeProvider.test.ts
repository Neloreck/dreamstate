import { ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { mockScopeProvider } from "@/dreamstate/test-utils/provision/mockScopeProvider";

describe("mockScopeProvider test util", () => {
  it("Should correctly return react provider class", () => {
    expect(mockScopeProvider()).toBe(ScopeContext.Provider);
  });
});
