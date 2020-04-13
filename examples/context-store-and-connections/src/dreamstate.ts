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
  useMemo,
  memo,
  useLayoutEffect,
  useRef,
  MutableRefObject,
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
const STORE_REGISTRY: {
  MANAGERS: IStringIndexed<ContextManager<any>>;
  OBSERVERS: IStringIndexed<Set<TUpdateObserver>>;
  SUBSCRIBERS: IStringIndexed<Set<TUpdateSubscriber<any>>>;
  CONTEXTS: IStringIndexed<Context<any>>;
  STATES: IStringIndexed<any>;
} = {
  MANAGERS: {},
  OBSERVERS: {},
  SUBSCRIBERS: {},
  CONTEXTS: {},
  STATES: {}
};

/**
 * Symbol keys for internals.
 */
const IDENTIFIER_KEY: unique symbol = Symbol(process.env.IS_DEV === "true" ? "DS_ID" : "");

/**
 * Types.
 */
interface IStringIndexed<T> {
  [index: string]: T;
}

interface IHotNodeModule extends NodeModule {
  hot: {
    data: IStringIndexed<any>;
    dispose(data: IStringIndexed<any>): void;
  };
}

interface IContextManagerConstructor<T extends object> {
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
  finisher?: <T>(clazz: TConstructor<T>) => void | TConstructor<T>;
}

interface MethodDescriptor extends ClassElement {
  kind: 'method';
  descriptor: PropertyDescriptor;
}
// Proposal end.

type TPartialTransformer<T> = (value: T) => Partial<T>;

type TUpdateObserver = () => void;

type TUpdateSubscriber<T extends object> = (context: T) => void;

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
  if (STORE_REGISTRY.OBSERVERS[managerConstructor[IDENTIFIER_KEY]].size === 0) {
    // @ts-ignore protected and symbol properties.
    STORE_REGISTRY.MANAGERS[managerConstructor[IDENTIFIER_KEY]].onProvisionStarted();
  }

  STORE_REGISTRY.OBSERVERS[managerConstructor[IDENTIFIER_KEY]].add(observer);
}

/**
 * Remove state changes observer and kill instance if it is not singleton.
 */
function removeObserver<T extends object>(managerConstructor: IContextManagerConstructor<T>, observer: TUpdateObserver): void {
  // Remove observer.
  STORE_REGISTRY.OBSERVERS[managerConstructor[IDENTIFIER_KEY]].delete(observer);

  if (STORE_REGISTRY.OBSERVERS[managerConstructor[IDENTIFIER_KEY]].size === 0) {
    const instance: ContextManager<T> | undefined = STORE_REGISTRY.MANAGERS[managerConstructor[IDENTIFIER_KEY]];

    if (!instance) {
      throw new Error("Could not find manager instance when removing last observer.");
    } else {
      // @ts-ignore protected.
      instance.onProvisionEnded();
      // @ts-ignore protected field, do not expose it for external usage.
      if (!managerConstructor.IS_SINGLETON) {
        delete STORE_REGISTRY.STATES[managerConstructor[IDENTIFIER_KEY]];
        delete STORE_REGISTRY.MANAGERS[managerConstructor[IDENTIFIER_KEY]];
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
    if (!managerConstructor.hasOwnProperty(IDENTIFIER_KEY) || !STORE_REGISTRY.MANAGERS.hasOwnProperty(managerConstructor[IDENTIFIER_KEY])) {
      const instance: ContextManager<T> = new managerConstructor();
      STORE_REGISTRY.STATES[managerConstructor[IDENTIFIER_KEY]] = instance.context;
      STORE_REGISTRY.MANAGERS[managerConstructor[IDENTIFIER_KEY]] = instance;
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
      : createElement(
      sources[current].getContextType().Provider,
      { value: STORE_REGISTRY.STATES[sources[current][IDENTIFIER_KEY]] },
      provideSubTree(current + 1, bottom, sources)
      )
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

  if (process.env.IS_DEV === "true") {
    Observer.displayName = `Dreamstate.Observer.[${sources.map((it: TConsumable<any>) => it.name.replace(MANAGER_REGEX, EMPTY_STRING) )}]`;
  } else {
    Observer.displayName = "DS.Observer";
  }

  // Hoc helper for decorated components to prevent odd renders.
  return memo(Observer) as any;
}

/**
 * Compare context manager state diff with shallow check + nested objects check.
 */
function shouldObserversUpdate<T extends object>(manager: ContextManager<T>, nextContext: IStringIndexed<any>): boolean {
  const previousContext: IStringIndexed<any> = STORE_REGISTRY.STATES[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]];

  return Object
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
  STORE_REGISTRY.STATES[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]] = nextContext;
  STORE_REGISTRY.OBSERVERS[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]].forEach(((it: TUpdateObserver) => it()));
  STORE_REGISTRY.SUBSCRIBERS[(manager.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]].forEach(((it: TUpdateSubscriber<T>) => it(nextContext)));
}

function createManagersConsumer(target: ComponentType, sources: Array<TConsumable<any>>) {
  // Only dev assistance with detailed messages.
  if (process.env.IS_DEV === "true") {
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
  // todo: useContext will update HOC every time, it should not be expensive but implement check for only needed props if react will add it.
  function Consumer(ownProps: object) {

    let consumed: IStringIndexed<any> = {};

    for (const source of sources) {

      if (source.prototype instanceof ContextManager) {
        Object.assign(consumed, useManager(source))
      } else {

        const selector: TTakeContextSelector<any> = source.take;
        const context: IStringIndexed<any> = useManager(source.from);

        // No selector, probably want to make alias for class component.
        if (selector === undefined) {
          if (typeof source.as !== "undefined") {
            consumed[source.as] = context;
          } else {
            Object.assign(consumed, context);
          }
          // Selected array of needed props, filter only needed and alias if 'as' is supplied.
        } else if (Array.isArray(selector)) {
          const pickedData = (selector as Array<string>).reduce((a: IStringIndexed<any>, e: string) => (a[e] = context[e], a), {});
          Object.assign(consumed, source.as ? { [source.as]: pickedData } : pickedData);
          // Supplied functional selector, return object with needed props like redux does. Alias if 'as' is supplied.
        } else if (typeof selector === "function") {
          Object.assign(consumed, source.as ? { [source.as]:  selector(context) } :  selector(context));
          // todo:
        } else if (typeof selector === "object") {
          const pickedData = selector.take ? selector.take.reduce((a: IStringIndexed<any>, e: string) => (a[e] = context[selector.from][e], a), {}) : context[selector.from];

          if (typeof source.as === "undefined") {
            Object.assign(consumed, pickedData);
          } else {
            consumed[source.as] = pickedData;
          }
          // Provided string selector, only one prop is needed. Alias if 'as' is supplied.
        } else if (typeof selector === "string") {
          consumed[typeof source.as === "undefined" ? selector : source.as] = context[selector] ;
        }
      }
    }

    return createElement(target as any, Object.assign(consumed, ownProps));
  }

  if (process.env.IS_DEV === "true") {
    Consumer.displayName = `Dreamstate.Consumer.[${sources.map((it: TConsumable<any>) => it.prototype instanceof ContextManager
      ?  it.name.replace(MANAGER_REGEX, EMPTY_STRING)
      : `${it.from.name.replace(MANAGER_REGEX, EMPTY_STRING)}{${it.take}}`)}]`;
  } else {
    Consumer.displayName = "DS.Consumer";
  }

  return Consumer;
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

function useContextWithMemo<T extends object, D extends IContextManagerConstructor<T>>(
  managerConstructor: D,
  depsSelector: (context: T) => Array<any>
): D["prototype"]["context"] {
  const [ state, setState ] = useState(function () {
    return STORE_REGISTRY.STATES[managerConstructor[IDENTIFIER_KEY]];
  });
  const observed: MutableRefObject<Array<any>> = useRef(depsSelector(state));

  const updateMemoState: TUpdateSubscriber<T> = useCallback(function (nextContext: T): void {
    // Calculate changes like react lib does and fire change only after update.
    const nextObserved = depsSelector(nextContext);

    for (let it = 0; it < nextObserved.length; it ++) {
      if (observed.current[it] !== nextObserved[it]) {
        observed.current = nextObserved;
        setState(nextContext);
        return;
      }
    }
  }, EMPTY_ARR);

  useLayoutEffect(function () {
    STORE_REGISTRY.SUBSCRIBERS[managerConstructor[IDENTIFIER_KEY]].add(updateMemoState);
    return function () {
      STORE_REGISTRY.SUBSCRIBERS[managerConstructor[IDENTIFIER_KEY]].delete(updateMemoState);
    }
  });

  return state;
}
/**
 * Exported API.
 */

/**
 * Use manager hook, higher order wrapper for useContext.
 */
export function useManager<T extends object, D extends IContextManagerConstructor<T>>(
  managerConstructor: D,
  depsSelector?: (context: D["prototype"]["context"]) => Array<any>
): D["prototype"]["context"] {
  if (depsSelector) {
    return useContextWithMemo(managerConstructor, depsSelector);
  } else {
    return useContext(managerConstructor.getContextType());
  }
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
  return function(classOrDescriptor: ComponentType<any>) {
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
 * Hmr handler for context managers.
 * Logic included only in dev builds.
 */
export function Hmr(targetModule: NodeModule): any {
  // Clear explanation instead of undefined ref error.
  if (!targetModule) {
    throw new Error("Module reference should be provided for 'Hmr' decorator.");
  }
  // Higher order decorator to get module ref.
  return function <T>(targetOrDescriptor: object | ClassDescriptor, propertyKey: PropertyKey | undefined) {
    // Will not work in production mode.
    if (process.env.IS_DEV === "true") {
      // Dispose and write ID prop again.
      const handleDisposal = function (targetClass: TAnyContextManagerConstructor) {
        if ((targetModule as IHotNodeModule).hot) {
          // Preserve id reference to prevent broken UI.
          const oldId: any = (targetModule as IHotNodeModule).hot.data && (targetModule as any).hot.data.ID;

          if (oldId) {
            Object.defineProperty(targetClass, IDENTIFIER_KEY, { value: oldId, writable: false, configurable: false });

            if (STORE_REGISTRY.MANAGERS[oldId]) {
              const newManager = new targetClass();
              STORE_REGISTRY.MANAGERS[oldId] = newManager;
              STORE_REGISTRY.STATES[oldId] = newManager.context;
              // todo: MOUNT UNMOUNT DETECTION?
              if (STORE_REGISTRY.OBSERVERS[oldId].size) {
                // @ts-ignore privacy.
                STORE_REGISTRY.MANAGERS[(targetClass as TAnyContextManagerConstructor)[IDENTIFIER_KEY]].onProvisionStarted();
              }
            }
          }

          (targetModule as IHotNodeModule).hot.dispose(function (data: IStringIndexed<any>) {
            data.ID = (targetClass as TAnyContextManagerConstructor)[IDENTIFIER_KEY];
            // Notify managers about cleanup to prevent memory leaks.
            if (STORE_REGISTRY.MANAGERS[data.ID] && STORE_REGISTRY.OBSERVERS[data.ID].size) {
              // @ts-ignore privacy.
              STORE_REGISTRY.MANAGERS[(targetClass as TAnyContextManagerConstructor)[IDENTIFIER_KEY]].onProvisionEnded();
            }
          });
        }
      };
      // Support legacy and proposal decorators.
      if (propertyKey) {
        return handleDisposal(targetOrDescriptor as TAnyContextManagerConstructor);
      } else {
        (targetOrDescriptor as ClassDescriptor).finisher = function (clazz: TConstructor<any>): void {
          handleDisposal(clazz as TAnyContextManagerConstructor);
        };
        return targetOrDescriptor;
      }
    }
  }
}

export function enableHmr(module: NodeModule, target: object): void {
  Hmr(module)(target, true as any);
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
  // Lazy initialization for IDENTIFIER KEY.
  public static get [IDENTIFIER_KEY](): any {

    const id: symbol = Symbol(process.env.IS_DEV === "true" ? this.name : "");

    // Lazy preparation of state and observers internal storage.
    STORE_REGISTRY.STATES[id as any] = {};
    STORE_REGISTRY.OBSERVERS[id as any] = new Set();
    STORE_REGISTRY.SUBSCRIBERS[id as any] = new Set();

    Object.defineProperty(this, IDENTIFIER_KEY, { value: id, writable: false, configurable: false });

    return id;
  }

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

      if (process.env.IS_DEV === "true") {
        if ((typeof next !== "function" && typeof next !== "object") || next === null) {
          console.warn(
            "If you want to update specific non-object state variable, use setContext instead. " +
            "Custom setters are intended to help with nested state objects. " +
            `State updater should be an object or a function. Supplied value type: ${typeof next}.`
          );
        }
      }

      return manager.setContext({
        [key]: Object.assign({}, manager.context[key], typeof next === "function" ? next(manager.context[key]) : next) } as any
      );
    };

  // todo: Solve typing problem here: Should we check undefined?

  /**
   * Get current provided manager.
   */
  public static current<S extends object, T extends ContextManager<S>>(this: IContextManagerConstructor<S> & { new(): T; }): T {
    return STORE_REGISTRY.MANAGERS[this[IDENTIFIER_KEY]] as T;
  }

  /**
   * Get current provided manager context.
   */
  public static currentContext<S extends object, T extends ContextManager<S>>(this: IContextManagerConstructor<S> & { new(): T; }): T["context"] {
    const manager: T = STORE_REGISTRY.MANAGERS[this[IDENTIFIER_KEY]] as T;
    return manager ? manager.context : undefined as any;
  }

  /**
   * Utility getter.
   * Singleton generator.
   * Allows to get related React.Context for manual renders.
   */
  public static getContextType<T extends object>(): Context<T> {

    if (STORE_REGISTRY.CONTEXTS.hasOwnProperty(this[IDENTIFIER_KEY])) {
      const reactContextType: Context<T> = STORE_REGISTRY.CONTEXTS[this[IDENTIFIER_KEY]];

      Object.defineProperty(this, 'getContextType', { value: function () { return reactContextType; }, writable: false, configurable: false });
      return reactContextType;
    } else {
      const reactContextType: Context<T> = createContext(null as any);

      if (process.env.IS_DEV === "true") {
        reactContextType.displayName = "Dreamstate." + this.name.replace(MANAGER_REGEX, EMPTY_STRING);
      } else {
        reactContextType.displayName = "DS." + this.name.replace(MANAGER_REGEX, EMPTY_STRING);
      }

      STORE_REGISTRY.CONTEXTS[this[IDENTIFIER_KEY]] = reactContextType;
      Object.defineProperty(this, 'getContextType', { value: function () { return reactContextType; }, writable: false, configurable: false });
      return this.getContextType();
    }
  }

  /**
   * Abstract store/actions bundle.
   * Left for generic implementation.
   */
  public abstract context: T;

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

    if (process.env.IS_DEV === "true") {
      if ((typeof next !== "function" && typeof next !== "object") || next === null) {
        console.warn(`Seems like wrong prop was supplied to the 'setContext' method. Context state updater should be an object or a function. Supplied value type: ${typeof next}.`);
      }
    }

    const previousContext: T = this.context;
    const nextContext: T = Object.assign({}, previousContext, typeof next === "function" ? next(previousContext) : next);

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
}
