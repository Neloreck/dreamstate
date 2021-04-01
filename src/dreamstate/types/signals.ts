import { TAnyContextServiceConstructor } from "@/dreamstate/types/internal";

export interface IBaseSignal<T extends TSignalType = TSignalType, D = undefined> extends Object{
  /**
   * Type of current signal.
   */
  type: T;
  /**
   * Data of current signal base call.
   */
  data?: D;
}

export interface ISignalWithoutData<T extends TSignalType = TSignalType> extends Object {
  /**
   * Type of current signal.
   */
  type: T;
}

export interface ISignalWithData<T extends TSignalType = TSignalType, D = undefined, > extends Object {
  /**
   * Type of current signal.
   */
  type: T;
  /**
   * Data of current signal.
   */
  data: D;
}

export interface ISignalEvent<T extends TSignalType, D> extends IBaseSignal<T, D> {
  /**
   * Strict type of current signal data.
   */
  data: D;
  /**
   * Signal sender.
   */
  emitter: TAnyContextServiceConstructor | null;
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

export type TSignalListener<T extends TSignalType = TSignalType, D = undefined> = (signal: ISignalEvent<T, D>) => void;

export type TSignalSubscriptionMetadata = Array<[string | symbol, TSignalType | Array<TSignalType>]>;

export type TDerivedSignal<T extends TSignalType = TSignalType, D = undefined> =
  Readonly<D extends undefined ? ISignalWithoutData<T> : ISignalWithData<T, D>>;

export type TDerivedSignalEvent<
  T extends TSignalType | ISignalWithData | ISignalWithoutData = TSignalType,
  D = undefined
> =
  Readonly<T extends ISignalWithData<TSignalType, any>
    ? ISignalEvent<T["type"], T["data"]>
    : T extends ISignalWithoutData
      ? ISignalEvent<T["type"], undefined>
      : ISignalEvent<T extends TSignalType ? T : never, D>>;
