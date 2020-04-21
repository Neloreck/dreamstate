import type { NESTED_STORE_KEY } from "../internals";

export type TStateSetter<T extends object, K extends keyof T> = (value: Partial<T[K]>) => void;

export interface ILoadable<T, E = Error> {
  [NESTED_STORE_KEY]: boolean;
  // Data.
  error: E | null;
  isLoading: boolean;
  value: T | null;
  // Methods.
  asFailed(error: E, value?: T): ILoadable<T, E>;
  asLoading(value?: T): ILoadable<T, E>;
  asReady(value: T): ILoadable<T, E>;
  asUpdated(value: T): ILoadable<T, E>;
}

export interface IMutable<T> {
  [NESTED_STORE_KEY]: boolean;
  asMerged(state: Partial<T>): TMutable<T>;
}

export type TMutable<T> = T & IMutable<T>;
