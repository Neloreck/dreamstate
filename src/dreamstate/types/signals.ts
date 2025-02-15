import type { TAnyObject } from "@/dreamstate/types/general";
import type { TAnyContextManagerConstructor } from "@/dreamstate/types/internal";

/**
 * Represents allowed signal types.
 * A signal type can be a symbol, string, or number.
 */
export type TSignalType = symbol | string | number;

/**
 * A base signal containing a type and optional data fields.
 * Defines the structure of a basic signal, including its type and optional data.
 */
export interface IBaseSignal<D = undefined> extends TAnyObject {
  /**
   * The type of the current signal.
   */
  readonly type: TSignalType;
  /**
   * The data associated with the current signal, optional.
   */
  readonly data?: D;
}

/**
 * A signal that contains only the type field.
 * Represents a signal with a type but no associated data.
 */
export interface ISignalWithoutData extends TAnyObject {
  /**
   * The type of the current signal.
   */
  readonly type: TSignalType;
}

/**
 * A signal that contains both the type and data fields.
 * Represents a signal with both a type and associated data.
 */
export interface ISignalWithData<D = undefined> extends TAnyObject {
  /**
   * The type of the current signal.
   */
  readonly type: TSignalType;
  /**
   * The data associated with the current signal.
   */
  readonly data: D;
}

/**
 * A signal event emitted within a scope.
 * Extends IBaseSignal with additional properties, including the emitter and timestamp.
 */
export interface ISignalEvent<D = undefined> extends IBaseSignal<D> {
  /**
   * The data of the current signal event.
   * This field is strictly typed based on the signal data.
   */
  readonly data: D;
  /**
   * The emitter of the signal.
   * Can be a context manager constructor or null if no emitter is specified.
   */
  readonly emitter: TAnyContextManagerConstructor | null;
  /**
   * The timestamp when the signal event was emitted.
   */
  readonly timestamp: number;
  /**
   * Flag indicating whether the signal has been canceled.
   */
  canceled?: boolean;

  /**
   * Method to stop the signal from being handled by subsequent listeners.
   */
  cancel(): void;
}

/**
 * A generic signal listener method.
 * Listens for and handles emitted signal events.
 */
export type TSignalListener<D = undefined> = (signal: ISignalEvent<D>) => void;

/**
 * Class metadata containing information about signal handlers.
 * Represents an array of signal types and their corresponding subscriptions.
 */
export type TSignalSubscriptionMetadata = Array<[string | symbol, TSignalType | Array<TSignalType>]>;

/**
 * A derived signal type based on the provided data.
 * Resolves to either ISignalWithoutData or ISignalWithData depending on the presence of data.
 */
export type TDerivedSignal<D = undefined> = D extends undefined ? ISignalWithoutData : ISignalWithData<D>;
