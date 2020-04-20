import type { ComponentType, Context } from "react";

import type { IDENTIFIER_KEY, MUTABLE_KEY } from "./internals";
import type { ContextManager } from "./management";

export interface IStringIndexed<T> {
  [index: string]: T;
}

export interface IContextManagerConstructor<T extends object> {
  // Unique identifier for context manager.
  [IDENTIFIER_KEY]: any;
  // Related react context object.
  REACT_CONTEXT: Context<T>;
  // Basic constructor props.
  prototype: ContextManager<T>;
  new(): ContextManager<T>;
}

export type TPartialTransformer<T> = (value: T) => Partial<T>;

export type TUpdateObserver = () => void;

export type TUpdateSubscriber<T extends object> = (context: T) => void;

export type TConstructor<T> = {
  new (...args: unknown[]): T;
};

export type TContextFunctionalSelector<T extends object, R extends object = object> = (context: T) => R | Partial<T>;

export type TTakeContextSelector<T extends object> =
  keyof T | Array<keyof T> | TContextFunctionalSelector<T> | undefined;

export type TStateSetter<T extends object, K extends keyof T> = (value: Partial<T[K]>) => void;

export type TAnyContextManagerConstructor = IContextManagerConstructor<any>;

export type TConsumable<T extends TAnyContextManagerConstructor> = IConsumePick<T> | T;

export interface IConsumePick<
  TContextConstructor extends IContextManagerConstructor<any>,
  TContextState extends object = TContextConstructor["prototype"]["context"]
>{
  from: TContextConstructor;
  take?: TTakeContextSelector<TContextState>;
  as?: string;
}

export interface ILoadable<T, E = Error> {
  // Data.
  error: E | null;
  isLoading: boolean;
  value: T | null;
  // Methods.
  asInitial(): ILoadable<T, E>;
  asFailed(error: E, value?: T): ILoadable<T, E>;
  asLoading(value?: T): ILoadable<T, E>;
  asReady(value: T): ILoadable<T, E>;
  asUpdated(value: T): ILoadable<T, E>;
}

export interface IMutable<T> {
  [MUTABLE_KEY]: boolean;
  asMerged(state: Partial<T>): TMutable<T>;
}

export type TMutable<T> = T & IMutable<T>;

/**
 * todo: Wait for variadic arguments from typescript and remove this awful hardcode nesting.
 * Declaration export interface (temp) for consumer decorator.
 */
export interface IConsume {
  // Mock for variadic selectors.
  <
    A extends TAnyContextManagerConstructor, B extends TAnyContextManagerConstructor,
    C extends TAnyContextManagerConstructor, D extends TAnyContextManagerConstructor,
    E extends TAnyContextManagerConstructor, F extends TAnyContextManagerConstructor
  >(
    managersOrSelectors:
      [ TConsumable<A> ] |
      [ TConsumable<A>, TConsumable<B> ] |
      [ TConsumable<A>, TConsumable<B>, TConsumable<C>, TConsumable<D> ] |
      [ TConsumable<A>, TConsumable<B>, TConsumable<C>, TConsumable<D>, TConsumable<F> ]
  ): <P>(component: ComponentType<P>) => ComponentType<P>;
  // Default usage with context managers.
  (managersOrSelectors: Array<TAnyContextManagerConstructor>): <T>(component: ComponentType<T>) => ComponentType<T>;
}

/**
 * todo: Wait for variadic arguments from typescript and remove this awful hardcode nesting.
 * Declaration export interface (temp) for consumer decorator.
 */
export interface IConsumeDecorator {
  // Mock for variadic selectors.
  <
    A extends TAnyContextManagerConstructor,
    B extends TAnyContextManagerConstructor,
    C extends TAnyContextManagerConstructor,
    D extends TAnyContextManagerConstructor,
    E extends TAnyContextManagerConstructor,
    F extends TAnyContextManagerConstructor
  >(
    managersOrSelectors:
    [ TConsumable<A> ] |
    [ TConsumable<A>, TConsumable<B> ] |
    [ TConsumable<A>, TConsumable<B>, TConsumable<C> ] |
    [ TConsumable<A>, TConsumable<B>, TConsumable<C>, TConsumable<D> ] |
    [ TConsumable<A>, TConsumable<B>, TConsumable<C>, TConsumable<D>, TConsumable<E> ] |
    [ TConsumable<A>, TConsumable<B>, TConsumable<C>, TConsumable<D>, TConsumable<E>, TConsumable<F> ]
  ): ClassDecorator;
  // Default usage with context managers.
  (managersOrSelectors: Array<TAnyContextManagerConstructor>): ClassDecorator;
}

/**
 * From the TC39 Decorators proposal.
 */
export interface ClassElement {
  kind: "field" | "method";
  key: PropertyKey;
  placement: "static" | "prototype" | "own";
  initializer?: Function;
  extras?: ClassElement[];
  finisher?: <T>(clazz: TConstructor<T>) => void | undefined | TConstructor<T>;
  descriptor?: PropertyDescriptor;
}

export interface MethodDescriptor extends ClassElement {
  kind: "method";
  descriptor: PropertyDescriptor;
}

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

export interface ISignalEvent<D = undefined, T extends TSignalType = TSignalType> extends ISignal<D, T> {
  /**
   * Signal sender.
   */
  emitter: ContextManager<any> | null;
  /**
   * Stop signal handling by next listeners.
   */
  cancel(): void;
  /**
   * Stop signal handling flag.
   */
  cancelled?: boolean;
}

export type TSignalType = symbol | string | number;

export type TSignalListener<D = undefined, T extends TSignalType = TSignalType> = (signal: ISignalEvent<D, T>) => void;

export type TSignalSubscriptionMetadata = Array<[ string | symbol, TSignalType | Array<TSignalType> ]>;

export interface IQueryRequest<D = undefined, T extends TSignalType = TSignalType> {
  /**
   * Query key type for search matching.
   */
  type: T;
  /**
   * Query requested data params.
   */
  data: D;
}


export type TQueryType = symbol | string | number;

export type TQuerySubscriptionMetadata = Array<[ string | symbol, TSignalType ]>;

export interface IQueryResponse<D = undefined, T extends TQueryType = TQueryType> {
  type: T;
  data: D;
  answerer: ContextManager<any>;
}

export type TQueryResponse<D = undefined, T extends TQueryType = TQueryType> = null | IQueryResponse<D, T>;
