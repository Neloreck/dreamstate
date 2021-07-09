import { shallow } from "enzyme";
import { default as React } from "react";

import { provideSubTreeRecursive } from "@/dreamstate/core/provision/combined/provideSubTreeRecursive";
import { createRegistry, IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";
import { NestedManager, TestManager } from "@/fixtures";

describe("provideSubTreeRecursive rendering", () => {
  it("Should match snapshot", () => {
    const registry: IRegistry = createRegistry();
    const providers: Array<TAnyContextManagerConstructor> = [
      TestManager,
      NestedManager,
      TestManager
    ];

    const emptyRecursiveRender = shallow(
      <div>
        {
          provideSubTreeRecursive(
            <div> bottom </div>,
            providers,
            registry.CONTEXT_STATES_REGISTRY
          )
        }
      </div>
    );

    expect(emptyRecursiveRender).toMatchSnapshot();

    registry.CONTEXT_STATES_REGISTRY.set(TestManager, { first: "is" });
    registry.CONTEXT_STATES_REGISTRY.set(NestedManager, { second: "is" });

    const providedRecursiveRender = shallow(
      <div>
        {
          provideSubTreeRecursive(
            <div> bottom </div>,
            providers,
            registry.CONTEXT_STATES_REGISTRY
          )
        }
      </div>
    );

    expect(providedRecursiveRender).toMatchSnapshot();
  });
});
