import { Consume } from "@Lib/consumption/Consume";
import { IConsume } from "@Lib/types";

/**
 * HOC alias for @Consume.
 */
export const withConsumption: IConsume = Consume as IConsume;
