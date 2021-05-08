import { shallow } from "enzyme";
import React from "react";

import { provideSubTreeRecursive } from "@/dreamstate/core/provision/combined/provideSubTreeRecursive";
import { createRegistry, IRegistry } from "@/dreamstate/core/registry/createRegistry";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";
import { NestedContextManager, TestContextManager } from "@/fixtures";

describe("provideSubTreeRecursive rendering", () => {
  it("Should match snapshot", () => {
    const registry: IRegistry = createRegistry();
    const providers: Array<TAnyContextManagerConstructor> = [
      TestContextManager,
      NestedContextManager,
      TestContextManager
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

    registry.CONTEXT_STATES_REGISTRY.set(TestContextManager, { first: "is" });
    registry.CONTEXT_STATES_REGISTRY.set(NestedContextManager, { second: "is" });

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
