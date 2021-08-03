import { TAnyObject } from "@/dreamstate/types/general";

/**
 * Loadable store entry that manages transactional transitions for state updates.
 */
export interface ILoadable<T, E = Error> {
  readonly error: E | null;
  readonly isLoading: boolean;
  readonly value: T | null;
  asFailed(error: E, value?: T): ILoadable<T, E>;
  asLoading(value?: T): ILoadable<T, E>;
  asReady(value?: T): ILoadable<T, E>;
  asUpdated(value: T, isLoading?: boolean, error?: E | null): ILoadable<T, E>;
}

/**
 * Nested store base.
 */
export interface INestedBase<T> {
  asMerged(state: Partial<T>): TNested<T>;
}

export type TNested<T> = T & INestedBase<T>;

/**
 * Computed field base methods with selectors.
 */
export interface IComputedBase<T extends TAnyObject, C extends TAnyObject> {
  readonly __selector__: (context: C) => T;
  readonly __memo__?: (context: C) => Array<any>;
  readonly __diff__?: Array<any>;
}

export type TComputed<T extends TAnyObject, C extends TAnyObject = any> = T & IComputedBase<T, C>;
