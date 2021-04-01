import { Provide } from "@/dreamstate/core/provision/Provide";
import { TAnyContextServiceConstructor } from "@/dreamstate/types/";

/**
 * HOC alias for @Provide.
 */
export const withProvision = Provide as <T>(sources: Array<TAnyContextServiceConstructor>) => ((component: T) => T);
