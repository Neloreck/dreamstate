import { TAnyObject } from "@/dreamstate/types/general";

export interface INestedStore {
}

export type TStateSetter<T extends TAnyObject, K extends keyof T> = (value: Partial<T[K]>) => void;

export interface ILoadable<T, E = Error> extends INestedStore {
  error: E | null;
  isLoading: boolean;
  value: T | null;
  asFailed(error: E, value?: T): ILoadable<T, E>;
  asLoading(value?: T): ILoadable<T, E>;
  asReady(value: T): ILoadable<T, E>;
  asUpdated(value: T): ILoadable<T, E>;
}

export type TLoadable<T, E = Error> = Readonly<ILoadable<T, E>>;

export interface INested<T> extends INestedStore {
  asMerged(state: Partial<T>): TNested<T>;
}

export type TNested<T> = T & INested<T>;

export interface IComputed<T extends TAnyObject, C extends TAnyObject> {
  __selector__: (context: C) => T;
  __memo__?: (context: C) => Array<any>;
  __diff__?: Array<any>;
}

export type TComputed<T extends TAnyObject, C extends TAnyObject = any> = Readonly<T & IComputed<T, C>>;
