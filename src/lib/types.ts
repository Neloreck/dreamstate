import { ComponentType, Context } from "react";

import { ContextManager } from "./management";
import { IDENTIFIER_KEY, MUTABLE_KEY, SIGNAL_LISTENER_LIST_KEY } from "./internals";

export interface IStringIndexed<T> {
  [index: string]: T;
}

export interface IContextManagerConstructor<T extends object> {
  [IDENTIFIER_KEY]: any;
  [SIGNAL_LISTENER_LIST_KEY]: TSignalSubs;
  prototype: ContextManager<T>;
  new(): ContextManager<T>;
  REACT_CONTEXT: Context<T>;
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
  TContextConstructor extends TAnyContextManagerConstructor, TContextState extends object =
  TContextConstructor["prototype"]["context"]
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

export type TLoadable<T, E = Error> = ILoadable<T, E>;

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
  <A extends TAnyContextManagerConstructor, B extends TAnyContextManagerConstructor,
    C extends TAnyContextManagerConstructor, D extends TAnyContextManagerConstructor,
    E extends TAnyContextManagerConstructor, F extends TAnyContextManagerConstructor
  >(
    a: TConsumable<A>,
    b?: TConsumable<B>,
    c?: TConsumable<C>,
    d?: TConsumable<D>,
    e?: TConsumable<E>,
    f?: TConsumable<F>,
  ): <T>(component: ComponentType<T>) => ComponentType<T>;
  // Default usage with context managers.
  (...managers: Array<TAnyContextManagerConstructor>): <T>(component: ComponentType<T>) => ComponentType<T>;
}

/**
 * todo: Wait for variadic arguments from typescript and remove this awful hardcode nesting.
 * Declaration export interface (temp) for consumer decorator.
 */
export interface IConsumeDecorator {
  // Mock for variadic selectors.
  <A extends TAnyContextManagerConstructor, B extends TAnyContextManagerConstructor,
    C extends TAnyContextManagerConstructor, D extends TAnyContextManagerConstructor,
    E extends TAnyContextManagerConstructor, F extends TAnyContextManagerConstructor
  >(
    a: TConsumable<A>,
    b?: TConsumable<B>,
    c?: TConsumable<C>,
    d?: TConsumable<D>,
    e?: TConsumable<E>,
    f?: TConsumable<F>,
  ): ClassDecorator;
  // Default usage with context managers.
  (...managers: Array<TAnyContextManagerConstructor>): ClassDecorator;
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

export interface ClassDescriptor {
  kind: "class";
  elements: ClassElement[];
  finisher?: <T>(clazz: TConstructor<T>) => void | TConstructor<T>;
}

export interface MethodDescriptor extends ClassElement {
  kind: "method";
  descriptor: PropertyDescriptor;
}

export interface IBaseSignal<T extends TSignalType, D>{
  /**
   * Type of current signal.
   */
  type: T;
  /**
   * Data of current signal.
   */
  data?: D;
}

export interface ISignal<T extends TSignalType, D> extends IBaseSignal<T, D> {
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

export type TSignalListener<T extends TSignalType, D> = (signal: ISignal<T, D>) => void;

export type TSignalSubs = Array<[ string | symbol, (signal: TSignalType) => boolean ]>;
