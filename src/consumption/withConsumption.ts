import { Consume } from "./Consume";
import { IConsume } from "../types";

/**
 * HOC alias for @Consume.
 */
export const withConsumption: IConsume = Consume as IConsume;
