import {
  createContext,
  createElement,
  Context,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
  ReactElement,
  ComponentType,
  useCallback,
  useMemo
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

/**
 * Constants references.
 */

const EMPTY_STRING: string = "";
const EMPTY_ARR: Array<never> = [];
const MANAGER_REGEX: RegExp = /Manager$/;
const REGISTRY: IStringIndexed<ContextManager<any>> = {};

/**
 * Symbol keys for internals.
 */

const IDENTIFIER_KEY: unique symbol = Symbol("DS_CM");
const OBSERVERS_KEY: unique symbol = Symbol("DS_OBSERVERS");
const CONTEXT_KEY: unique symbol = Symbol("DS_CONTEXT");
const CURRENT_STATE_KEY: unique symbol = Symbol("DS_CONTEXT");

/**
 * Types.
 */

interface IStringIndexed<T> {
  [index: string]: T;
}

interface IContextManagerConstructor<T extends object> {
  [OBSERVERS_KEY]: Array<TUpdateObserver>;
  [IDENTIFIER_KEY]: any;
  [CURRENT_STATE_KEY]: T;
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

interface MethodDescriptor extends ClassElement {
  kind: 'method';
  descriptor: PropertyDescriptor;
}
// Proposal end.

type TPartialTransformer<T> = (value: T) => Partial<T>;

type TUpdateObserver = () => void;

type TConstructor<T> = {
  new (...args: unknown[]): T
};

type TObjectKey<T> = T extends object ? { [K in keyof T]: K }[keyof T] : never;

type TContextFunctionalSelector<T extends object, R extends object = object> = (context: T) => R | Partial<T>;

type TContextObjectSelector<T extends object> =  { [K in keyof T]: { from: K, take: Array<TObjectKey<T[K]>> } }[keyof T]

type TTakeContextSelector<T extends object> = keyof T | Array<keyof T> | TContextObjectSelector<T> | TContextFunctionalSelector<T> | undefined;

export type TStateSetter<T extends object, K extends keyof T> = (value: Partial<T[K]>) => void;

export type TAnyContextManagerConstructor = IContextManagerConstructor<any>;

export type TConsumable<T extends TAnyContextManagerConstructor> = IConsumePick<T> | T;

export interface IConsumePick<TContextConstructor extends TAnyContextManagerConstructor, TContextState extends object= TContextConstructor["prototype"]["context"]> {
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
 * Internal lib utils.
 */

/**
 * Add state changes observer.
 */
function addObserver<T extends object>(managerConstructor: IContextManagerConstructor<T>, observer: TUpdateObserver): void {
  // Notify about provision, if it is first observer.
  if (managerConstructor[OBSERVERS_KEY].length === 0) {
    // @ts-ignore protected and symbol properties.
    REGISTRY[managerConstructor[IDENTIFIER_KEY]].onProvisionStarted();
  }

  managerConstructor[OBSERVERS_KEY].push(observer);
}

/**
 * Remove state changes observer and kill instance if it is not singleton.
 */
function removeObserver<T extends object>(managerConstructor: IContextManagerConstructor<T>, observer: (value: T) => void): void {
  // Remove observer.
  managerConstructor[OBSERVERS_KEY] = managerConstructor[OBSERVERS_KEY].filter((it) => it !== observer);

  if (managerConstructor[OBSERVERS_KEY].length === 0) {
    const instance: ContextManager<T> | undefined = REGISTRY[managerConstructor[IDENTIFIER_KEY]];

    if (!instance) {
      throw new Error("Could not find manager instance when removing last observer.");
    } else {
      // @ts-ignore protected.
      instance.onProvisionEnded();
      // @ts-ignore protected field, do not expose it for external usage.
      if (!managerConstructor.IS_SINGLETON) {
        // @ts-ignore protected field, do not expose it for external usage.
        instance.beforeDestroy();
        delete managerConstructor[CURRENT_STATE_KEY];
        delete REGISTRY[managerConstructor[IDENTIFIER_KEY]];
      }
    }
  }
}

/**
 * Initialize context manager once before tree mount and use memo.
 * Subscribe to adding/removing observers on mount/unmount.
 */
function useLazyInitializeManager<T extends object>(managerConstructor: IContextManagerConstructor<T>, updateObserver: () => void): void {
  // Lazy init before observing with memo.
  useMemo(function (): void {
    // Only if registry is empty -> create new instance, remember its context and save it to registry.
    if (!managerConstructor.hasOwnProperty(IDENTIFIER_KEY) || !REGISTRY.hasOwnProperty(managerConstructor[IDENTIFIER_KEY])) {
      const instance: ContextManager<T> = new managerConstructor();
      // @ts-ignore symbol properties.
      managerConstructor[CURRENT_STATE_KEY] = instance.context;
      REGISTRY[managerConstructor[IDENTIFIER_KEY]] = instance;
    }
  }, EMPTY_ARR);

  useEffect(() => {
    addObserver(managerConstructor, updateObserver);
    return () => removeObserver(managerConstructor, updateObserver);
  }, EMPTY_ARR);
}

/**
 * Subtree provider as global scope helper.
 */
function provideSubTree(current: number, bottom: ReactElement, sources: Array<TAnyContextManagerConstructor>): ReactElement {
  return (
    current >= sources.length
      ? bottom
      : createElement(sources[current].getContextType().Provider, { value: sources[current][CURRENT_STATE_KEY] }, provideSubTree(current + 1, bottom, sources))
  );
}

/**
 * Utility method for observers creation.
 */
function createManagersObserver(children: ComponentType | null, sources: Array<TAnyContextManagerConstructor>) {
  // Create observer component that will handle observing.
  function Observer(props: IStringIndexed<any>): ReactElement {
    // Update providers subtree utility.
    const [ , updateState ] = useState();
    const updateProviders = useCallback(function () { updateState({}); }, EMPTY_ARR);
    // Subscribe to tree updater and lazily get first context value.
    for (let it = 0; it < sources.length; it ++) {
      useLazyInitializeManager(sources[it], updateProviders);
    }

    return provideSubTree(0, (children ? createElement(children, props) : props.children), sources);
  }

  if (process.env.IS_DEV) {
    Observer.displayName = `Dreamstate.Observer.[${sources.map((it: TConsumable<any>) => it.name.replace(MANAGER_REGEX, EMPTY_STRING) )}]`;
  } else {
    Observer.displayName = "DS.Observer";
  }

  return Observer as any;
}

/**
 * Compare context manager state diff with shallow check + nested objects check.
 */
function shouldObserversUpdate<T extends object>(manager: ContextManager<T>, nextContext: IStringIndexed<any>): boolean {
  const previousContext: IStringIndexed<any> = (manager.constructor as IContextManagerConstructor<T>)[CURRENT_STATE_KEY];

  return  Object
    .keys(nextContext)
    .some((key: string): boolean =>
      typeof nextContext[key] === "object"
        ? !shallowEqualObjects(nextContext[key], previousContext[key])
        : nextContext[key] !== previousContext[key]
    );
}

/**
 * Notify observers and check if update is needed.
 */
function notifyObservers<T extends IStringIndexed<any>>(manager: ContextManager<T>, nextContext: T): void {
  (manager.constructor as IContextManagerConstructor<T>)[CURRENT_STATE_KEY] = nextContext;
  (manager.constructor as IContextManagerConstructor<T>)[OBSERVERS_KEY].forEach(((it) => it()))
}

function createManagersConsumer(target: ComponentType, sources: Array<TConsumable<any>>) {
  // Only dev assistance with detailed messages.
  if (process.env.IS_DEV) {
    // Warn about too big consume count.
    if (sources.length > 5) {
      console.warn(
        "Seems like your component tries to consume more than 5 stores at once, more than 5 can lead to slower rendering for big components." +
        " Separate consuming by using multiple Consume decorators/hocs for one component or review your components structure.",
        `Source: '${target.name}'.`
      );
    }

    // Validate input sources.
    for (const source of sources) {
      if (typeof source === "object") {
        if (!source.from || typeof source.from !== "function") {
          throw new TypeError(`Specified 'from' selector should point to correct context manager. Supplied type: '${typeof source.from}'. Check '${target.name}' component.`);
        } else if (!(source.from.prototype instanceof ContextManager)) {
          throw new TypeError(`Specified consume target should inherit 'ContextManager', seems like you have forgotten to extend your manager class. Wrong parameter: '${source.from.name || "anonymous function."}'. Check '${target.name}' component.`);
        }

        if (typeof source.as !== "undefined" && typeof source.as !== "string") {
          throw new TypeError(`Specified 'as' param should point to string component property key. Supplied type: '${typeof source.as}'. Check '${target.name}' component.`);
        }

        if (source.take === null) {
          throw new TypeError(`Specified 'take' param should be a valid selector. Selectors can be functional, string, array or object. Supplied type: '${typeof source}'. Check '${target.name}' component.`);
        }
      } else if (typeof source === "function") {
        if (!(source.prototype instanceof ContextManager)) {
          throw new TypeError(`Specified consume target should inherit 'ContextManager', seems like you have forgotten to extend your manager class. Wrong parameter: '${source.name || "anonymous function"}'. Check '${target.name}' component.`);
        }
      } else {
        throw new TypeError(`Specified consume source is not selector or context manager. Supplied type: '${typeof source}'. Check '${target.name}' component.`);
      }
    }
  } else {
    for (const source of sources) {
      if (
        (typeof source !== "object" && typeof source !== "function")
        ||
        (
          typeof source === "object" && (
            (!source.from || typeof source.from !== "function" || !(source.from.prototype instanceof ContextManager)) ||
            (typeof source.as !== "undefined" && typeof source.as !== "string") ||
            source.take === null
          )
        )
        ||
        typeof source === "function" && !(source.prototype instanceof ContextManager)
      ) {
        throw new TypeError("Wrong context-consume parameter supplied.");
      }
    }
  }

  // HOC component to pick props and provide needed/selected.
  function Consumer(ownProps: object) {

    let consumed: IStringIndexed<any> = {};

    for (const source of sources) {

      if (source.prototype instanceof ContextManager) {
        Object.assign(consumed, useManager(source))
      } else {

        const selector: TTakeContextSelector<any> = source.take;
        const context: IStringIndexed<any> = useManager(source.from);

        if (selector === undefined) {
          if (typeof source.as !== "undefined") {
            consumed[source.as] = context;
          } else {
            Object.assign(consumed, context);
          }
        } else if (Array.isArray(selector)) {
          const pickedData = (selector as Array<string>).reduce((a: IStringIndexed<any>, e: string) => (a[e] = context[e], a), {});
          Object.assign(consumed, source.as ? { [source.as]: pickedData } : pickedData);
        } else if (typeof selector === "function") {
          Object.assign(consumed, source.as ? { [source.as]:  selector(context) } :  selector(context));
        } else if (typeof selector === "object") {
          const pickedData = selector.take ? selector.take.reduce((a: IStringIndexed<any>, e: string) => (a[e] = context[selector.from][e], a), {}) : context[selector.from];

          if (typeof source.as === "undefined") {
            Object.assign(consumed, pickedData);
          } else {
            consumed[source.as] = pickedData;
          }
        } else if (typeof selector === "string") {
          consumed[typeof source.as === "undefined" ? selector : source.as] = context[selector] ;
        }
      }
    }

    return createElement(target as any, Object.assign(consumed, ownProps));
  }

  if (process.env.IS_DEV) {
    Consumer.displayName = `Dreamstate.Consumer.[${sources.map((it: TConsumable<any>) => it.prototype instanceof ContextManager
      ?  it.name.replace(MANAGER_REGEX, EMPTY_STRING)
      : `${it.from.name.replace(MANAGER_REGEX, EMPTY_STRING)}{${it.take}}`)}]`;
  } else {
    Consumer.displayName = "DS.Consumer";
  }

  return Consumer;
}

/**
 * Exported API.
 */

/**
 * Use manager hook, higher order wrapper for useContext.
 */
export function useManager<T extends object, D extends IContextManagerConstructor<T>>(managerConstructor: D): D["prototype"]["context"] {
  return useContext(managerConstructor.getContextType());
}

/**
 * Decorator factory.
 * Provide context from context managers.
 * Observes changes and uses default react Providers for data flow.
 *
 * Creates legacy or proposal decorator based on used environment.
 */
export function Provide (...sources: Array<TAnyContextManagerConstructor>) {
  // Support legacy and proposal decorators. Create observer of requested managers.
  return function(classOrDescriptor: ComponentType) {
    return ((typeof classOrDescriptor === 'function'))
      ? hoistNonReactStatics(createManagersObserver(classOrDescriptor, sources), classOrDescriptor)
      : ({
        ...(classOrDescriptor as ClassDescriptor),
        finisher: (wrappedComponent: ComponentType) => hoistNonReactStatics(createManagersObserver(wrappedComponent, sources), wrappedComponent)
      });
  };
}

/**
 * HOC alias for @Provide.
 */
export const withProvision = Provide;

/**
 * Create component for manual provision without HOC/Decorator-like api.
 * Useful if your root is functional component or you are using createComponent api without JSX.
 */
export function createProvider (...sources: Array<TAnyContextManagerConstructor>): FunctionComponent<{}> {
  return createManagersObserver(null, sources);
}

/**
 * Decorator factory.
 * Consumes context from context manager.
 * Observes changes and uses default react Provider.
 */
export const Consume: IConsumeDecorator = function (...sources: Array<TConsumable<any>>): any {
  // Higher order decorator to reserve params.
  return function(classOrDescriptor: ComponentType) {
    // Support legacy and proposal decorators.
    return ((typeof classOrDescriptor === 'function'))
      ? hoistNonReactStatics(createManagersConsumer(classOrDescriptor, sources), classOrDescriptor)
      : ({
        ...(classOrDescriptor as ClassDescriptor),
        finisher: (wrappedComponent: ComponentType) => hoistNonReactStatics(createManagersConsumer(wrappedComponent, sources), wrappedComponent)
      });
  };
} as any;

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
 * Bind decorator wrappers factory for methods binding.
 */
function createBoundDescriptor <T>(from: TypedPropertyDescriptor<T>, property: PropertyKey) {
  // Descriptor with lazy binding.
  return ({
    configurable: true,
    get(this: object): T {
      const bound: T = (from as any).value.bind(this);

      Object.defineProperty(this, property, {
        value: bound,
        configurable: true,
        writable: true
      });

      return bound;
    }
  });
}

/**
 * Decorator factory.
 * Modifies method descriptor, so it will be bound to prototype instance once.
 * All credits: 'https://www.npmjs.com/package/autobind-decorator'.
 */
export function Bind(): MethodDecorator {
  // Higher order decorator to reserve closure parameters for futuure.
  return function<T>(targetOrDescriptor: object | MethodDescriptor, propertyKey: PropertyKey | undefined, descriptor: TypedPropertyDescriptor<T> | undefined) {
    // Different behaviour for legacy and proposal decorators.
    if (propertyKey && descriptor) {
      // If it is legacy method decorator.
      if (typeof descriptor.value !== 'function') {
        throw new TypeError(`Only methods can be decorated with @Bind. ${propertyKey.toString()} is not a method.`);
      } else {
        return createBoundDescriptor(descriptor, propertyKey);
      }
    } else {
      // If it is not proposal method decorator.
      if ((targetOrDescriptor as MethodDescriptor).kind !== "method") {
        throw new TypeError(`Only methods can be decorated with @Bind. ${(targetOrDescriptor as MethodDescriptor).key.toString()} is not a method.`);
      } else {
        (targetOrDescriptor as MethodDescriptor).descriptor = createBoundDescriptor((targetOrDescriptor as MethodDescriptor).descriptor, (targetOrDescriptor as MethodDescriptor).key)
        return targetOrDescriptor;
      }
    }
  };
}

/**
 * Abstract class.
 * Class based context manager for react.
 * Current Issue: Static items inside of each class instance.
 */
export abstract class ContextManager<T extends object> {

  public static [IDENTIFIER_KEY]: any;

  public static [OBSERVERS_KEY]: Array<TUpdateObserver>;

  public static [CONTEXT_KEY]: Context<any>;

  public static [CURRENT_STATE_KEY]: any;

  /**
   * Should dreamstate destroy store instance after observers removal or preserve it for application lifespan.
   * Singleton objects will never be destroyed once created.
   * Non-singleton objects are destroyed if all observers are removed.
   */
  protected static IS_SINGLETON: boolean = false;

  /**
   * Setter method factory.
   * !Strictly typed generic method with 'update' lifecycle.
   * Helps to avoid boilerplate code with manual 'update' transactional updates for simple methods.
   */
  public static getSetter = <S extends object, D extends keyof S>(manager: ContextManager<S>, key: D) =>
    (next: Partial<S[D]> | TPartialTransformer<S[D]>): void => {
      return manager.setContext({
        [key]: Object.assign({}, manager.context[key], typeof next === "function" ? next(manager.context[key]) : next) } as any
      );
    };

  /**
   * Get current provided manager.
   */
  public static current<S extends object, T extends ContextManager<S>>(this: IContextManagerConstructor<S> & { new(): T; }): T {
    return REGISTRY[this[IDENTIFIER_KEY]] as T;
  }

  /**
   * Utility getter.
   * Singleton generator.
   * Allows to get related React.Context for manual renders.
   */
  public static getContextType<T extends object>(): Context<T> {

    if (!this.hasOwnProperty(CONTEXT_KEY)) {

      const reactContextType: Context<T> = createContext(null as any);

      if (process.env.IS_DEV) {
        reactContextType.displayName = "Dreamstate." + this.name.replace(MANAGER_REGEX, EMPTY_STRING);
      } else {
        reactContextType.displayName = "DS." + this.name.replace(MANAGER_REGEX, EMPTY_STRING);
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
   */
  public forceUpdate(): void {
    // Force updates and common lifecycle with same params.
    this.beforeUpdate(this.context);
    this.context = Object.assign({}, this.context);
    notifyObservers(this, this.context);
    this.afterUpdate(this.context);
  }

  /**
   * Update current context from partially supplied state.
   * Calls lifecycle methods.
   */
  public setContext(next: Partial<T> | TPartialTransformer<T>): void {

    const previousContext: T = this.context;
    const nextContext: T = Object.assign({}, previousContext, next);

    if (shouldObserversUpdate(this, nextContext)) {
      this.beforeUpdate(nextContext);
      this.context = nextContext;
      notifyObservers(this, nextContext);
      this.afterUpdate(previousContext);
    }
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
  protected beforeUpdate(nextContext: T): void {}

  /**
   * Lifecycle.
   * After update lifecycle event.
   * Also shared for 'getSetter' methods.
   */
  protected afterUpdate(previousContext: T): void {}

  /**
   * Lifecycle.
   * Fired when last instance of context manager observer is removed and it will be destroyed.
   */
  protected beforeDestroy(context: T): void {}

}
