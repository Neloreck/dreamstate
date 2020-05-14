import { ComponentType } from "react";

import { IContextManagerConstructor, TAnyContextManagerConstructor } from "@Lib/types/internal";

export type TContextFunctionalSelector<T extends object, R extends object = object> = (context: T) => R | Partial<T>;

export type TTakeContextSelector<T extends object> =
  | keyof T
  | Array<keyof T>
  | TContextFunctionalSelector<T>
  | undefined;

export type TConsumable<T extends TAnyContextManagerConstructor> = IConsumePick<T> | T;

export interface IConsumePick<
  T extends IContextManagerConstructor<any>,
  S extends object = T["prototype"]["context"]
> {
  from: T;
  take?: TTakeContextSelector<S>;
  as?: string;
}

/**
 * todo: Wait for variadic arguments from typescript and remove this awful hardcode nesting.
 * Declaration export interface (temp) for consumer decorator.
 */
export interface IConsume {
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
      | [ TConsumable<A> ]
      | [ TConsumable<A>, TConsumable<B> ]
      | [ TConsumable<A>, TConsumable<B>, TConsumable<C>, TConsumable<D> ]
      | [ TConsumable<A>, TConsumable<B>, TConsumable<C>, TConsumable<D>, TConsumable<F> ]
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
      | [TConsumable<A>]
      | [TConsumable<A>, TConsumable<B>]
      | [TConsumable<A>, TConsumable<B>, TConsumable<C>]
      | [TConsumable<A>, TConsumable<B>, TConsumable<C>, TConsumable<D>]
      | [TConsumable<A>, TConsumable<B>, TConsumable<C>, TConsumable<D>, TConsumable<E>]
      | [TConsumable<A>, TConsumable<B>, TConsumable<C>, TConsumable<D>, TConsumable<E>, TConsumable<F>]
  ): ClassDecorator;
  // Default usage with context managers.
  (managersOrSelectors: Array<TAnyContextManagerConstructor>): ClassDecorator;
}
