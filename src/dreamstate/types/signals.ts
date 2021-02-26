import { TDreamstateService } from "@/dreamstate/types/internal";

export interface ISignal<D = undefined, T extends TSignalType = TSignalType> {
  /**
   * Type of current signal.
   */
  type: T;
  /**
   * Data of current signal.
   */
  data?: D;
}

export interface ISignalEvent<D = any, T extends TSignalType = TSignalType> extends ISignal<D, T> {
  /**
   * Strict type of current signal data.
   */
  data: D;
  /**
   * Signal sender.
   */
  emitter: TDreamstateService | null;
  /**
   * Signal emit timestamp.
   */
  timestamp: number;
  /**
   * Stop signal handling by next listeners.
   */
  cancel(): void;
  /**
   * Stop signal handling flag.
   */
  canceled?: boolean;
}

export type TSignalType = symbol | string | number;

export type TSignalListener<D = undefined, T extends TSignalType = TSignalType> = (signal: ISignalEvent<D, T>) => void;

export type TSignalSubscriptionMetadata = Array<[string | symbol, TSignalType | Array<TSignalType>]>;