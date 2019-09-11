import {
  createContext,
  createElement,
  Context,
  Consumer,
  useContext,
  useLayoutEffect,
  useState,
  useRef,
  ReactElement,
  MutableRefObject,
  Dispatch,
  SetStateAction,
  useCallback,
  ProviderExoticComponent,
  ProviderProps
} from "react";
import { default as hoistNonReactStatics } from "hoist-non-react-statics";
import { shallowEqualObjects } from "shallow-equal";

/*
 * 'https://github.com/Neloreck/dreamstate'
 *
 * OOP style context store for react.
 * Based on observing and using as small tree components count as possible.
 */

/**
 * Check current application mode.
 */
const IS_PRODUCTION: boolean = (process.env.NODE_ENV === "production");

/**
 * Regex for names changing.
 */
const MANAGER_REGEX: RegExp = /Manager/g;

/**
 * Empty string ref.
 */
const EMPTY: string = "";

/**
 * Empty array ref.
 */
const EMPTY_ARR: Array<never> = [];

/**
 * Interface for string indexed objects.
 */
interface IStringIndexed<T> {
  [index: string]: T;
}

/**
 * Any context manager type.
 */
export type TAnyCM = ContextManager<any>;

/**
 * Pick declaration.
 * Describe object that will help to get listed state params.
 */
export interface IConsumePick<A extends TAnyCM> {
  from: A;
  take: Array<keyof A["context"]>;
}

/**
 * Generic setter method.
 */
export type TSetter<T> = (value: T) => void;

/**
 * Consumable type.
 * Manager or pick descriptor.
 */
export type TConsumable<T extends TAnyCM> = IConsumePick<T> | T;

/**
 * Use manager hook, higher order wrapper for useContext.
 */
export const useManager = <T extends object>(manager: ContextManager<T>): T => useContext(manager.__internal);

/**
 * Decorator factory.
 * Provide context from context managers.
 * Observes changes and uses default react Providers for data flow.
 */
export const Provide = (...sources: Array<TAnyCM>): ClassDecorator => <T>(target: T) => {

  /**
   * Since we are using strictly defined closuer, we are able to use cached value and looped hooks there.
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

      const manager: TAnyCM = sources[it];

      const [ observedState, setObservedState ]: [ IStringIndexed<any>, Dispatch<SetStateAction<IStringIndexed<any>>> ] = useState(manager.getProvidedProps());
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
        manager.addObserver(setWithMemo);
        return () => manager.removeObserver(setWithMemo);
      }, EMPTY_ARR);

      /**
       * Update corresponding ref.
       */
      sourcesStates[it] = observedState as any;
    }

    /**
     * Recursive rendering of tree without
     */
    const provideSubTree = useCallback((current: number): ReactElement => {
      return (
        current >= sources.length
          ? createElement(target as any, props)
          : createElement(sources[current].getProvider(), { value: sourcesStates[current] }, provideSubTree(current + 1))
      );
    }, sourcesStates);

    /**
     * Render tree from root.
     */
    return provideSubTree(0);
  }

  /**
   * Use correct naming for non-production mode.
   */
  if (IS_PRODUCTION) {
    Observer.displayName = "D.O";
  } else {
    Observer.displayName = `Dreamstate.Observer.[${sources.map((it: TConsumable<any>) => it.constructor.name.replace(MANAGER_REGEX, EMPTY) )}]`;
  }

  return Observer as any;
};

/**
 * todo: Wait for variadic arguments from typescript and remove this awful hardcode nesting.
 * Declaration interface (temp) for consumer decorator.
 */
export interface IConsume {
  // Mock for variadic selectors.
  <A extends TAnyCM, B extends TAnyCM, C extends TAnyCM, D extends TAnyCM, E extends TAnyCM, F extends TAnyCM>(
    a: TConsumable<A>, b?: TConsumable<B>, c?: TConsumable<C>, d?: TConsumable<D>, e?: TConsumable<E>, f?: TConsumable<F>,
  ): ClassDecorator;
  // Default usage with context managers.
  (...managers: Array<ContextManager<any>>): ClassDecorator;
}

/**
 * Decorator factory.
 * Consumes context from context manager.
 * Observes changes and uses default react Provider.
 */
export const Consume: IConsume =
  (...sources: Array<TConsumable<any>>): any => {

    return <C>(target: C) => {

      function Consumer(props: any) {

        let consumed: IStringIndexed<any> = { ...props };

        for (const source of sources) {

          if (source instanceof ContextManager) {
            consumed = Object.assign(consumed, useManager(source))
          } else {

            const propsToPick: Array<string> = (source as IConsumePick<any>).take as Array<string>;
            const propsPicked: IStringIndexed<any> = useManager((source as IConsumePick<any>).from);

            consumed = Object.assign(consumed, propsToPick.reduce((a: IStringIndexed<any>, e: string) => (a[e] = propsPicked[e], a), {}));
          }
        }

        return createElement(target as any, { ...props, ...consumed });
      }

      /**
       * Use correct naming for non-production mode.
       */
      if (IS_PRODUCTION) {
        Consumer.displayName = "D.C";
      } else {
        Consumer.displayName = `Dreamstate.Consumer.[${sources.map((it: TConsumable<any>) => it instanceof ContextManager ?  it.constructor.name.replace(MANAGER_REGEX, EMPTY) : `${it.from.constructor.name.replace(MANAGER_REGEX, EMPTY)}{${it.take}}`)}]`;
      }

      return hoistNonReactStatics(Consumer, target as any);
    }
  };

/**
 * Abstract class.
 * Class based context manager for react.
 * Current Issue: Static items inside of each class instance.
 */
export abstract class ContextManager<T extends object> {

  /**
   * Setter method factory.
   * !Strictly typed generic method with 'update' lifecycle.
   * Helps to avoid boilerplate code with manual 'update' transactional updates for simple methods.
   */
  public static getSetter = <S extends object, D extends keyof S>(manager: ContextManager<S>, key: D) => {

    return (obj: Partial<S[D]>) => {
      manager.beforeUpdate();
      manager.context[key] = Object.assign({}, manager.context[key], obj);
      manager.observedElements.forEach((it) => it(manager.getProvidedProps()));
      manager.afterUpdate();
    };
  };

  /**
   * React Context<T> store internal.
   */
  public readonly __internal: Context<T>;

  /**
   * Abstract store/actions bundle.
   * Left for generic implementation.
   */
  public abstract context: T;

  /**
   * Array of provider observers.
   * Used for one app-level supply or for separate react dom sub-trees injection.
   */
  protected observedElements: Array<TSetter<any>> = [];

  /**
   * Default constructor.
   * Allows to create react context provider/consumer bundle.
   * Stores it as private readonly singleton per each storage.
   */
  public constructor() {

    this.__internal = createContext(this.getProvidedProps());

    if (IS_PRODUCTION) {
      this.__internal.displayName = "DS." + this.constructor.name.replace(MANAGER_REGEX, EMPTY);
    } else {
      this.__internal.displayName = "Dreamstate." + this.constructor.name.replace(MANAGER_REGEX, EMPTY);
    }
  }

  /**
   * Utility getter.
   * Allows to get related React.Consumer for manual renders.
   */
  public getConsumer(): Consumer<T> {
    return this.__internal.Consumer;
  }

  /**
   * Utility getter.
   * Allows to get related React.Provider for manual renders.
   */
  public getProvider(): ProviderExoticComponent<ProviderProps<T>> {
    return this.__internal.Provider;
  }

  /**
   * Utility getter.
   * Add state changes observer.
   */
  public addObserver(observer: (value: T) => void): void {

    if (this.observedElements.length === 0) {
      this.onProvisionStarted();
    }

    this.observedElements.push(observer);
  }

  /**
   * Utility getter.
   * Remove state changes observer.
   */
  public removeObserver(observer: (value: T) => void): void {

    this.observedElements = this.observedElements.filter((it) => it !== observer);

    if (this.observedElements.length === 0) {
      this.onProvisionEnded();
    }
  }

  /**
   * Force React.Provider update.
   * Calls lifecycle methods.
   * Should not cause odd renders because affects only related React.Provider elements (commonly - 1 per store).
   */
  public update(): void {

    this.beforeUpdate();
    this.observedElements.forEach((it: TSetter<any>) => it(this.getProvidedProps()));
    this.afterUpdate();
  }

  /**
   * Get provided context object.
   * Spread object every time for new references and provider HOC update.
   * It will not force consumers/React.Provider odd renders because actions/state nested objects will be separated.
   */
  public getProvidedProps(): T {
    return Object.assign({}, this.context);
  }

  /**
   * Lifecycle.
   * First provider was injected into DOM / Last provider was removed from DOM.
   */
  protected onProvisionStarted(): void {}
  protected onProvisionEnded(): void {}

  /**
   * Lifecycle.
   * Before/after manual update lifecycle event.
   * Also shares for 'getSetter' methods.
   *
   * todo: Previous state?
   */
  protected beforeUpdate(): void {}
  protected afterUpdate(): void {}

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
