import { createNested } from "@/dreamstate";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { TComputed, TLoadable, TNested } from "@/dreamstate/types";
import { createComputed } from "@/dreamstate/utils/createComputed";
import { createLoadable } from "@/dreamstate/utils/createLoadable";

export interface IContextWithUtils {
  nested: TNested<{
    loadable: TLoadable<number>;
    simpleString: string;
  }>;
  computed: TComputed<{
    booleanSwitch: boolean;
    concatenated: string;
  }>;
}

export class ManagerWithUtils extends ContextManager<IContextWithUtils> {

  public readonly context: IContextWithUtils = {
    nested: createNested({
      loadable: createLoadable(10),
      simpleString: "10"
    }),
    computed: createComputed((context: IContextWithUtils) => ({
      booleanSwitch: context.nested.simpleString.length > 2,
      concatenated: context.nested.simpleString + context.nested.simpleString + "!"
    }))
  };

}
