export interface INestedStore {
}

export type TStateSetter<T extends object, K extends keyof T> = (value: Partial<T[K]>) => void;

export interface ILoadable<T, E = Error> extends INestedStore {
  error: E | null;
  isLoading: boolean;
  value: T | null;
  asFailed(error: E, value?: T): ILoadable<T, E>;
  asLoading(value?: T): ILoadable<T, E>;
  asReady(value: T): ILoadable<T, E>;
  asUpdated(value: T): ILoadable<T, E>;
}

export interface IMutable<T> extends INestedStore {
  asMerged(state: Partial<T>): TMutable<T>;
}

export type TMutable<T> = T & IMutable<T>;
