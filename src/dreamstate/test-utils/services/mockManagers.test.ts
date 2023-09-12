import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { getCurrent } from "@/dreamstate/test-utils/registry/getCurrent";
import { mockScope } from "@/dreamstate/test-utils/registry/mockScope";
import { mockManagers } from "@/dreamstate/test-utils/services/mockManagers";
import { TManagerInstanceMap } from "@/dreamstate/types";
import { ExtendingManager, TestManager } from "@/fixtures";

describe("mockManagers test util", () => {
  it("should properly mock manager with context", () => {
    const scope: IScopeContext = mockScope();
    const map: TManagerInstanceMap = mockManagers([ TestManager ], null, scope);

    expect(map.get(TestManager)).toBeInstanceOf(TestManager);
    expect(map.get(ExtendingManager)).toBeUndefined();

    expect(getCurrent(TestManager, scope)).toBeInstanceOf(TestManager);
    expect(getCurrent(ExtendingManager, scope)).toBeNull();

    expect(getCurrent(TestManager, scope)).toBe(map.get(TestManager));

    expect(scope).toBeInstanceOf(Object);
    expect(scope.INTERNAL).toBeInstanceOf(Object);
    expect(scope.INTERNAL.REGISTRY.CONTEXT_INSTANCES_REGISTRY.size).toBe(1);
  });
});
