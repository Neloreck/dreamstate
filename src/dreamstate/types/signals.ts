import type { TAnyObject } from "@/dreamstate/types/general";
import type { TAnyContextManagerConstructor } from "@/dreamstate/types/internal";

/**
 * Allowed signal types.
 */
export type TSignalType = symbol | string | number;

/**
 * Base signal that contains type and optional data fields.
 */
export interface IBaseSignal<D = undefined> extends TAnyObject {
  /**
   * Type of current signal.
   */
  readonly type: TSignalType;
  /**
   * Data of current signal base call.
   */
  readonly data?: D;
}

/**
 * Signal that contains type field.
 */
export interface ISignalWithoutData extends TAnyObject {
  /**
   * Type of current signal.
   */
  readonly type: TSignalType;
}

/**
 * Signal that contains type and data fields.
 */
export interface ISignalWithData<D = undefined> extends TAnyObject {
  /**
   * Type of current signal.
   */
  readonly type: TSignalType;
  /**
   * Data of current signal.
   */
  readonly data: D;
}

/**
 * Signal event emitted in scope.
 */
export interface ISignalEvent<D = undefined> extends IBaseSignal<D> {
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
export type TSignalListener<D = undefined> = (signal: ISignalEvent<D>) => void;

/**
 * Class metadata containing information about signal handlers.
 */
export type TSignalSubscriptionMetadata = Array<[string | symbol, TSignalType | Array<TSignalType>]>;

/**
 * Derived signal type based on supplied parameters.
 */
export type TDerivedSignal<D = undefined> = D extends undefined ? ISignalWithoutData : ISignalWithData<D>;
