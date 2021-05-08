import type { TAnyContextManagerConstructor } from "@/dreamstate/types/internal";

/**
 * Allowed signal types.
 */
export type TSignalType = symbol | string | number;

/**
 * Base signal that contains type and optional data fields.
 */
export interface IBaseSignal<
  T extends TSignalType = TSignalType,
  D = undefined
> extends Object {
  /**
   * Type of current signal.
   */
  readonly type: T;
  /**
   * Data of current signal base call.
   */
  readonly data?: D;
}

/**
 * Signal that contains type field.
 */
export interface ISignalWithoutData<
  T extends TSignalType = TSignalType
> extends Object {
  /**
   * Type of current signal.
   */
  readonly type: T;
}

/**
 * Signal that contains type and data fields.
 */
export interface ISignalWithData<
  T extends TSignalType = TSignalType,
  D = undefined
> extends Object {
  /**
   * Type of current signal.
   */
  readonly type: T;
  /**
   * Data of current signal.
   */
  readonly data: D;
}

/**
 * Signal event emitted in scope.
 */
export interface ISignalEvent<T extends TSignalType, D> extends IBaseSignal<T, D> {
  /**
   * Strict type of current signal data.
   */
  readonly data: D;
  /**
   * Signal sender.
   */
  readonly emitter: TAnyContextManagerConstructor | null;
  /**
   * Signal emit timestamp.
   */
  readonly timestamp: number;
  /**
   * Stop signal handling by next listeners.
   */
  cancel(): void;
  /**
   * Stop signal handling flag.
   */
  canceled?: boolean;
}

/**
 * Generic signal listening method.
 */
export type TSignalListener<T extends TSignalType = TSignalType, D = undefined> = (signal: ISignalEvent<T, D>) => void;

/**
 * Class metadata containing information about signal handlers.
 */
export type TSignalSubscriptionMetadata = Array<[string | symbol, TSignalType | Array<TSignalType>]>;

/**
 * Derived signal type based on supplied parameters.
 */
export type TDerivedSignal<T extends TSignalType = TSignalType, D = undefined> =
  D extends undefined ? ISignalWithoutData<T> : ISignalWithData<T, D>;

/**
 * Derived signal event type based on supplied parameters.
 * Allows signal event declaration in a few ways - object/few parameters.
 */
export type TDerivedSignalEvent<
  T extends TSignalType | ISignalWithData | ISignalWithoutData = TSignalType,
  D = undefined
> =
  T extends ISignalWithData<TSignalType, any>
    ? ISignalEvent<T["type"], T["data"]>
    : T extends ISignalWithoutData
      ? ISignalEvent<T["type"], undefined>
      : ISignalEvent<T extends TSignalType ? T : never, D>;
