import {
  createContext,
  createElement,
  Context,
  FunctionComponent,
  useContext,
  useLayoutEffect,
  useState,
  useRef,
  ReactElement,
  MutableRefObject,
  Dispatch,
  SetStateAction,
  useCallback,
  ComponentType, Component,
} from "react";
import { default as hoistNonReactStatics } from "hoist-non-react-statics";
import { shallowEqualObjects } from "shallow-equal";

/*
 *
 * 'https://github.com/Neloreck/dreamstate'
 *
 * OOP style context store for react.
 * Based on observing and using as small tree components count as possible.
 */

const IS_PRODUCTION: boolean = (process.env.NODE_ENV === "production");

/**
 * Constants references.
 */

const EMPTY_STRING: string = "";
const EMPTY_ARR: Array<never> = [];
const MANAGER_REGEX: RegExp = /Manager/g;
const REGISTRY: IStringIndexed<ContextManager<any>> = {};

/**
 * Symbol keys for internals.
 */

const IDENTIFIER_KEY: unique symbol = Symbol("DS_CM");
const OBSERVERS_KEY: unique symbol = Symbol("DS_OBSERVERS");
const CONTEXT_KEY: unique symbol = Symbol("DS_CONTEXT");

/**
 * Types.
 */

interface IStringIndexed<T> {
  [index: string]: T;
}

interface IContextManagerConstructor<T extends object> {
  [OBSERVERS_KEY]: Array<TSetter<T>>;
  [IDENTIFIER_KEY]: any;
  prototype: ContextManager<T>;
  new(): ContextManager<T>;
  getContextType(): Context<T>;
}


// From the TC39 Decorators proposal.
interface ClassElement {
  kind: 'field' | 'method';
  key: PropertyKey;
  placement: 'static' | 'prototype' | 'own';
  initializer?: Function;
  extras?: ClassElement[];
  finisher?: <T>(clazz: TConstructor<T>) => undefined | TConstructor<T>;
  descriptor?: PropertyDescriptor;
}

interface ClassDescriptor {
  kind: 'class';
  elements: ClassElement[];
  finisher?: <T>(clazz: TConstructor<T>) => undefined | TConstructor<T>;
}

type TSetter<T> = (value: T) => void;

type TConstructor<T> = {
  new (...args: unknown[]): T
};

export type TStateSetter<T extends object, K extends keyof T> = (value: Partial<T[K]>) => void;

export type TAnyContextManagerConstructor = IContextManagerConstructor<any>;

export type TConsumable<T extends TAnyContextManagerConstructor> = IConsumePick<T> | T;

export interface IConsumePick<A extends TAnyContextManagerConstructor> {
  from: A;
  take: Array<keyof A["prototype"]["context"]>;
}

export interface ILoadable<T, E = Error> {
  // Data.
  error: E | null;
  isLoading: boolean;
  value: T | null;
  // Methods.
  asInitial(): ILoadable<T, E>;
  asFailed(error: E): ILoadable<T, E>;
  asLoading(): ILoadable<T, E>;
  asReady(value: T): ILoadable<T, E>;
  asUpdated(value: T): ILoadable<T, E>;
}

/**
 * todo: Wait for variadic arguments from typescript and remove this awful hardcode nesting.
 * Declaration interface (temp) for consumer decorator.
 */
export interface IConsume {
  // Mock for variadic selectors.
  <A extends TAnyContextManagerConstructor, B extends TAnyContextManagerConstructor, C extends TAnyContextManagerConstructor, D extends TAnyContextManagerConstructor, E extends TAnyContextManagerConstructor, F extends TAnyContextManagerConstructor>(
    a: TConsumable<A>, b?: TConsumable<B>, c?: TConsumable<C>, d?: TConsumable<D>, e?: TConsumable<E>, f?: TConsumable<F>,
  ): <T>(component: ComponentType<T>) => ComponentType<T>;
  // Default usage with context managers.
  (...managers: Array<TAnyContextManagerConstructor>): <T>(component: ComponentType<T>) => ComponentType<T>;
}

/**
 * todo: Wait for variadic arguments from typescript and remove this awful hardcode nesting.
 * Declaration interface (temp) for consumer decorator.
 */
export interface IConsumeDecorator {
  // Mock for variadic selectors.
  <A extends TAnyContextManagerConstructor, B extends TAnyContextManagerConstructor, C extends TAnyContextManagerConstructor, D extends TAnyContextManagerConstructor, E extends TAnyContextManagerConstructor, F extends TAnyContextManagerConstructor>(
    a: TConsumable<A>, b?: TConsumable<B>, c?: TConsumable<C>, d?: TConsumable<D>, e?: TConsumable<E>, f?: TConsumable<F>,
  ): ClassDecorator;
  // Default usage with context managers.
  (...managers: Array<TAnyContextManagerConstructor>): ClassDecorator;
}

/**
 * Internal utils.
 */

/**
 * Subtree provider as global scope helper.
 */
function provideSubTree(current: number, bottom: ReactElement, sources: Array<TAnyContextManagerConstructor>, states: Array<IStringIndexed<any>>): ReactElement {
  return (
    current >= sources.length
      ? bottom
      : createElement(sources[current].getContextType().Provider, { value: states[current] }, provideSubTree(current + 1, bottom, sources, states))
  );
}

/**
 * Utility method for observers creation.
 */
function createManagersObserver(children: ComponentType | null, sources: Array<TAnyContextManagerConstructor>) {

  /**
   * Since we are using strictly defined closure, we are able to use cached value and looped hooks there.
   * todo: Weak map there?
   */
  const sourcesStates: Array<IStringIndexed<any>> = new Array(sources.length);

  function Observer(props: IStringIndexed<any>): ReactElement {

    /**
     * Remove old states references after observer removal. Prevent memory leaks.
     */
    useLayoutEffect(() => () => { sourcesStates.splice(0, sourcesStates.length) }, EMPTY_ARR);

    /**
     * Collect states for future updates/rendering.
     */
    for (let it = 0; it < sources.length; it ++) {

      const managerClass: TAnyContextManagerConstructor = sources[it];

      const [ observedState, setObservedState ]: [ IStringIndexed<any>, Dispatch<SetStateAction<IStringIndexed<any>>> ] = useManagerLazyInit(managerClass);
      const observedStateRef: MutableRefObject<IStringIndexed<any>> = useRef(observedState);
      /**
       * ShouldComponent update for correct states observing with less rendering.
       */
      const setWithMemo = useCallback((newState: IStringIndexed<any>): void => {

        if (Object.keys(observedStateRef.current).some((key: string): boolean => !shallowEqualObjects(observedStateRef.current[key], newState[key]))) {
          observedStateRef.current = newState;
          setObservedState(newState);
        }
      }, EMPTY_ARR);

      /**
       * Layout for sync tracking and state updates if next-in-tree component will use depending from it props etc.
       */
      useLayoutEffect(() => {
        addObserver(managerClass, setWithMemo);
        return () => removeObserver(managerClass, setWithMemo);
      }, EMPTY_ARR);

      /**
       * Update corresponding ref.
       */
      sourcesStates[it] = observedState as any;
    }

    /**
     * Render tree from root.
     */
    return provideSubTree(0, (children ? createElement(children, props) : props.children), sources, sourcesStates);
  }

  /**
   * Use correct naming for non-production mode.
   */
  if (IS_PRODUCTION) {
    Observer.displayName = "D.O";
  } else {
    Observer.displayName = `Dreamstate.Observer.[${sources.map((it: TConsumable<any>) => it.name.replace(MANAGER_REGEX, EMPTY_STRING) )}]`;
  }

  return Observer as any;
}

function createManagersConsumer(target: ComponentType, sources: Array<TConsumable<any>>) {

  function Consumer(ownProps: object) {

    let consumed: IStringIndexed<any> = {};

    for (const source of sources) {

      if (source.prototype instanceof ContextManager) {
        Object.assign(consumed, useManager(source))
      } else {

        const propsToPick: Array<string> = (source as IConsumePick<any>).take as Array<string>;
        const propsPicked: IStringIndexed<any> = useManager((source as IConsumePick<any>).from);

        Object.assign(consumed, propsToPick.reduce((a: IStringIndexed<any>, e: string) => (a[e] = propsPicked[e], a), {}));
      }
    }

    return createElement(target as any, Object.assign(consumed, ownProps));
  }

  /**
   * Use correct naming for non-production mode.
   */
  if (IS_PRODUCTION) {
    Consumer.displayName = "D.C";
  } else {
    Consumer.displayName = `Dreamstate.Consumer.[${sources.map((it: TConsumable<any>) => it.prototype instanceof ContextManager
      ?  it.name.replace(MANAGER_REGEX, EMPTY_STRING)
      : `${it.from.name.replace(MANAGER_REGEX, EMPTY_STRING)}{${it.take}}`)}]`;
  }

  return Consumer;
}

/**
 * Utility getter.
 * Add state changes observer.
 */
function addObserver<T extends object>(manager: IContextManagerConstructor<T>, observer: (value: T) => void): void {

  if (manager[OBSERVERS_KEY].length === 0) {
    // @ts-ignore protected.
    REGISTRY[manager[IDENTIFIER_KEY]].onProvisionStarted();
  }

  manager[OBSERVERS_KEY].push(observer);
}

/**
 * Utility getter.
 * Remove state changes observer.
 */
function removeObserver<T extends object>(manager: IContextManagerConstructor<T>, observer: (value: T) => void): void {

  manager[OBSERVERS_KEY] = manager[OBSERVERS_KEY].filter((it) => it !== observer);

  if (manager[OBSERVERS_KEY].length === 0) {
    if (!REGISTRY[manager[IDENTIFIER_KEY]]) {
      throw new Error("Context manager already defined in registry. Is it memory leak?");
    } else {
      // @ts-ignore protected.
      REGISTRY[manager[IDENTIFIER_KEY]].onProvisionEnded();
      delete REGISTRY[manager[IDENTIFIER_KEY]];
    }
  }
}

/**
 * Utility to initialize first state from manager state.
 * Wrapped in lambda to prevent code execution for each render.
 */
function useManagerLazyInit<T extends object>(manager: IContextManagerConstructor<T>) {

  return useState(() => {

    let instance: ContextManager<T>;

    if (manager.hasOwnProperty(IDENTIFIER_KEY) && REGISTRY.hasOwnProperty(manager[IDENTIFIER_KEY])) {
      instance = REGISTRY[manager[IDENTIFIER_KEY]];
    } else {
      instance = new manager();
      REGISTRY[manager[IDENTIFIER_KEY]] = instance;
    }

    return instance.getProvidedProps()
  });
}

/**
 * Exported API.
 */

/**
 * Use manager hook, higher order wrapper for useContext.
 */
export const useManager = <T extends object, D extends IContextManagerConstructor<T>>(managerConstructor: D): D["prototype"]["context"] => useContext(managerConstructor.getContextType());

/**
 * Decorator factory.
 * Provide context from context managers.
 * Observes changes and uses default react Providers for data flow.
 *
 * Creates legacy or proposal decorator based on used environment.
 */
export const Provide = (...sources: Array<TAnyContextManagerConstructor>) => (classOrDescriptor: TConstructor<Component> | ClassDescriptor) =>
  ((typeof classOrDescriptor === 'function'))
    ? hoistNonReactStatics(createManagersObserver(classOrDescriptor, sources), classOrDescriptor)
    : ({
      ...classOrDescriptor,
      finisher: (wrappedComponent: TConstructor<Component>) => hoistNonReactStatics(createManagersObserver(wrappedComponent, sources), wrappedComponent)
    });

/**
 * HOC alias for @Provide.
 */
export const withProvision = Provide;

/**
 * Create component for manual provision without HOC/Decorator-like api.
 * Useful if your root is functional component or you are using createComponent api without JSX.
 */
export const createProvider = (...sources: Array<TAnyContextManagerConstructor>): FunctionComponent<{}> => createManagersObserver(null, sources);

/**
 * Decorator factory.
 * Consumes context from context manager.
 * Observes changes and uses default react Provider.
 */
export const Consume: IConsumeDecorator = (...sources: Array<TConsumable<any>>): any => (classOrDescriptor: TConstructor<Component> | ClassDescriptor) =>
  ((typeof classOrDescriptor === 'function'))
    ? hoistNonReactStatics(createManagersConsumer(classOrDescriptor, sources), classOrDescriptor)
    : ({
      ...classOrDescriptor,
      finisher: (wrappedComponent: TConstructor<Component>) => hoistNonReactStatics(createManagersConsumer(wrappedComponent, sources), wrappedComponent)
    });

/**
 * HOC alias for @Consume.
 */
export const withConsumption: IConsume = Consume as IConsume;

/**
 * Create loadable value utility.
 */
export function createLoadable<T, E>(initialValue: T | null = null): ILoadable<T, E> {
  return ({
    // Data.
    error: null,
    isLoading: false,
    value: initialValue,
    // Methods.
    asInitial(): ILoadable<T, E> {
      return { ...this, error: null, isLoading: false, value: initialValue };
    },
    asLoading(): ILoadable<T, E> {
      return { ...this, error: null, isLoading: true };
    },
    asFailed(error: E | null): ILoadable<T, E> {
      return { ...this, error, isLoading: false };
    },
    asReady(value: T | null): ILoadable<T, E> {
      return { ...this, error: null, isLoading: false, value };
    },
    asUpdated(value: T | null): ILoadable<T, E> {
      return { ...this, value };
    }
  });
}

/**
 * Decorator factory.
 * Modifies method descriptor, so it will be bound to prototype instance once.
 * All credits: 'https://www.npmjs.com/package/autobind-decorator'.
 */
export const Bind = (): MethodDecorator => <T>(target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

  let original: T = descriptor.value as T;

  if (typeof original !== "function") {
    throw new TypeError(`@Bind decorator can only be applied to methods not: ${typeof original}.`);
  }

  // In IE11 calling Object.defineProperty has a side-effect of evaluating the
  // getter for the property which is being replaced. This causes infinite
  // recursion and an "Out of stack space" error.
  let definingProperty = false;

  return {
    configurable: true,
    get(): T {

      // @ts-ignore functional interface.
      if (definingProperty || this === target.prototype || this.hasOwnProperty(propertyKey) || typeof original !== 'function') {
        return original;
      }

      const bound: T = original.bind(this);

      definingProperty = true;

      Object.defineProperty(this, propertyKey, {
        configurable: true,
        get(): T {
          return bound;
        },
        set(value: T): void {
          original = value;
          delete this[propertyKey];
        }
      });

      definingProperty = false;

      return bound;
    },
    set(value: T): void {
      original = value;
    }
  };
};

/**
 * Abstract class.
 * Class based context manager for react.
 * Current Issue: Static items inside of each class instance.
 */
export abstract class ContextManager<T extends object> {

  static [IDENTIFIER_KEY]: any;

  static [OBSERVERS_KEY]: Array<TSetter<any>>;

  static [CONTEXT_KEY]: Context<any>;

  /**
   * Setter method factory.
   * !Strictly typed generic method with 'update' lifecycle.
   * Helps to avoid boilerplate code with manual 'update' transactional updates for simple methods.
   */
  public static getSetter = <S extends object, D extends keyof S>(manager: ContextManager<S>, key: D) => {

    return (obj: Partial<S[D]>): void => {
      manager.beforeUpdate();
      manager.context[key] = Object.assign({}, manager.context[key], obj);
      // @ts-ignore symbol.
      manager.constructor[OBSERVERS_KEY].forEach((it) => it(manager.getProvidedProps()));
      manager.afterUpdate();
    };
  };

  /**
   * Get current provided manager.
   */
  public static current<S>(): S {
    // @ts-ignore symbol.
    return REGISTRY[this[IDENTIFIER_KEY]] as S;
  }

  /**
   * Utility getter.
   * Singleton generator.
   * Allows to get related React.Context for manual renders.
   */
  public static getContextType<T extends object>(): Context<T> {

    if (!this.hasOwnProperty(CONTEXT_KEY)) {

      const reactContextType: Context<T> = createContext(null as any);

      if (IS_PRODUCTION) {
        reactContextType.displayName = "DS." + this.name.replace(MANAGER_REGEX, EMPTY_STRING);
      } else {
        reactContextType.displayName = "Dreamstate." + this.name.replace(MANAGER_REGEX, EMPTY_STRING);
      }

      this[CONTEXT_KEY] = reactContextType;

      return reactContextType;
    }

    return this[CONTEXT_KEY];
  }

  /**
   * Abstract store/actions bundle.
   * Left for generic implementation.
   */
  public abstract context: T;

  public constructor() {

    if (!this.constructor.hasOwnProperty(IDENTIFIER_KEY)) {

      // @ts-ignore
      this.constructor[IDENTIFIER_KEY] = Symbol(this.constructor.name);
      // @ts-ignore
      this.constructor[OBSERVERS_KEY] = [];
    }
  }

  /**
   * Force React.Provider update.
   * Calls lifecycle methods.
   * Should not cause odd renders because affects only related React.Provider elements (commonly - 1 per store).
   */
  public forceUpdate(): void {

    this.beforeUpdate();
    // @ts-ignore constructor.
    this.constructor[OBSERVERS_KEY].forEach((it: TSetter<T>) => it(this.getProvidedProps()));
    this.afterUpdate();
  }

  /**
   * Get provided context object.
   * Spread object every time for new references and provider HOC update.
   * It will not force consumers/React.Provider odd renders because actions/state nested objects will be separated.
   */
  public getProvidedProps(): T {
    return { ...this.context };
  }

  /**
   * Lifecycle.
   * First provider was injected into DOM.
   */
  protected onProvisionStarted(): void {}

  /**
   * Lifecycle.
   * Last provider was removed from DOM.
   */
  protected onProvisionEnded(): void {}

  /**
   * Lifecycle.
   * Before update lifecycle event.
   * Also shared for 'getSetter' methods.
   */
  protected beforeUpdate(): void {}

  /**
   * Lifecycle.
   * After update lifecycle event.
   * Also shared for 'getSetter' methods.
   */
  protected afterUpdate(): void {}

}
