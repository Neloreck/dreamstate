import { Consume } from "@Lib/core/consumption/Consume";
import { IConsume } from "@Lib/core/types";

/**
 * HOC alias for @Consume.
 */
export const withConsumption: IConsume = Consume as IConsume;
