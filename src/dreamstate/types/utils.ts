import { TAnyObject } from "@/dreamstate/types/general";

export interface INestedStore {
}

export type TStateSetter<T extends TAnyObject, K extends keyof T> = (value: Partial<T[K]>) => void;

export interface ILoadable<T, E = Error> extends INestedStore {
  readonly error: E | null;
  readonly isLoading: boolean;
  readonly value: T | null;
  asFailed(error: E, value?: T): ILoadable<T, E>;
  asLoading(value?: T): ILoadable<T, E>;
  asReady(value: T): ILoadable<T, E>;
  asUpdated(value: T): ILoadable<T, E>;
}

export type TLoadable<T, E = Error> = ILoadable<T, E>;

export interface INested<T> extends INestedStore {
  asMerged(state: Partial<T>): TNested<T>;
}

export type TNested<T> = T & INested<T>;

export interface IComputed<T extends TAnyObject, C extends TAnyObject> {
  readonly __selector__: (context: C) => T;
  readonly __memo__?: (context: C) => Array<any>;
  readonly __diff__?: Array<any>;
}

export type TComputed<T extends TAnyObject, C extends TAnyObject = any> = T & IComputed<T, C>;
