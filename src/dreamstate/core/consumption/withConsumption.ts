import { Consume } from "@/dreamstate/core/consumption/Consume";
import { IConsume } from "@/dreamstate/types";

/**
 * HOC alias for @Consume.
 */
export const withConsumption: IConsume = Consume as IConsume;
