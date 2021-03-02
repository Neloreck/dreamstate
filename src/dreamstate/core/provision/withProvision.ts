import { Provide } from "@/dreamstate/core/provision/Provide";
import { TDreamstateService } from "@/dreamstate/types/";

/**
 * HOC alias for @Provide.
 */
export const withProvision = Provide as <T>(sources: Array<TDreamstateService>) => ((component: T) => T);
