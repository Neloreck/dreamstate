import * as React from "react";
import { createContext, Component, ComponentType, Context, Consumer, ReactNode, useContext } from "react";

/*
 * ±1.4KB min+gzip, only pure react codebase usage.
 *
 * 'https://github.com/Neloreck/dreamstate'
 *
 * OOP style context store for react.
 * Reactivity, lifecycle, strict TS typing, dependency injection + singleton pattern for each application store without boilerplate code.
 */

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
 * Consumable type.
 * Manager or pick descriptor.
 */
export type TConsumable<T extends TAnyCM> = IConsumePick<T> | T;

/**
 * Utility.
 * Shallow comparison for objects.
 */
export const shallowEqualObjects = (first: object, second: object): boolean => {

  if (first === second) {
    return true;
  }

  if (!first || !second) {
    return false;
  }

  const firstKeys: Array<string> = Object.keys(first);
  const secondKeys: Array<string> = Object.keys(second);

  const length: number = firstKeys.length;

  if (secondKeys.length !== length) {
    return false;
  }

  for (let it = 0; it < length; it ++) {

    const key: string = firstKeys[it];

    // @ts-ignore indexed for built-ins.
    if (first[key] !== second[key]) {
      return false;
    }
  }

  return true;
};

/**
 * Use manager hook, higher order wrapper for useContext.
 */
export const useManager = <T extends object>(manager: ContextManager<T>): T => useContext(manager.internalReactContext);

/**
 * Decorator factory.
 * Provide context from context manager.
 * Observes changes and uses default react Provider for data flow.
 */
export const Provide =
  (...managers: Array<TAnyCM>): ClassDecorator =>
    <T>(target: T) => {

      let element!: ComponentType;

      for (const manager of managers) {

        // Remember scoped element in closure block.
        const scopedElement = element || target;

        element = (props: IStringIndexed<any>) => React.createElement(manager.getProvider(), null, React.createElement(scopedElement, props));
      }

      return element as any;
    };

/**
 * todo: Wait for variadic arguments from typescript.
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
  (...sources: Array<TConsumable<any>>): any =>
    <C> (target: C) => {

      let element!: ComponentType;

      for (const source of sources) {

        // Remember scoped element in closure block.
        const scopedElement = element || target;

        if (source instanceof ContextManager) {

          element = ((renderProps: object) => React.createElement(
            source.getConsumer() as any,
            null,
            (contextProps: object) => React.createElement(scopedElement, { ...renderProps, ...contextProps }))) as any
        } else {

          const propsToPick: Array<string> = (source as IConsumePick<any>).take as Array<string>;

          element = (<P extends IStringIndexed<any>>(props: object) => React.createElement(
            (source as IConsumePick<any>).from.getConsumer() as any,
            null,
            (contextProps: P) => React.createElement(scopedElement,
              { ...props, ...propsToPick.reduce((a: IStringIndexed<any>, e: string) => (a[e] = contextProps[e], a), {}) })
          )) as any
        }
      }

      return element as any;
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
      manager.context[key] = { ...(manager.context as any)[key], ...(obj as object) };
      manager.observedElements.forEach((it) => it.setState(manager.getProvidedProps()));
      manager.afterUpdate();
    };
  };

  /**
   * Observer factory for react providers.
   * Allows to use lifecycle and observer pattern.
   *
   * todo: Functional with hooks?
   */
  private static getObserver = <T extends IStringIndexed<any>>(parent: ContextManager<T>): ComponentType => (

    class extends Component<any, T> {

      state: T = parent.getProvidedProps();

      public shouldComponentUpdate(nextProps: any, nextState: T): boolean {
        return Object.keys(this.state).some((key: string): boolean => !shallowEqualObjects(this.state[key], nextState[key]));
      }

      public componentDidMount(): void {

        if (parent.observedElements.length === 0) {
          parent.onProvisionStarted();
        }

        parent.observedElements.push(this);
      }

      public componentWillUnmount(): void {

        parent.observedElements = parent.observedElements.filter((it) => it !== this);

        if (parent.observedElements.length === 0) {
          parent.onProvisionEnded();
        }
      }

      public render(): ReactNode {
        return React.createElement(parent.internalReactContext.Provider,  { value: this.state }, this.props.children);
      }

    }
  );

  /**
   * React Context<T> store internal.
   */
  public readonly internalReactContext: Context<T>;

  /**
   * Abstract store/actions bundle.
   * Left for generic implementation.
   */
  public abstract context: T;

  /**
   * Array of provider observers.
   * Used for one app-level supply or for separate react dom sub-trees injection.
   */
  protected observedElements: Array<Component> = [];

  /**
   * Default constructor.
   * Allows to create react context provider/consumer bundle.
   * Stores it as private readonly singleton per each storage.
   */
  public constructor() {
    this.internalReactContext = createContext(this.getProvidedProps());
  }

  /**
   * Utility getter.
   * Allows to get related React.Consumer for manual renders.
   */
  public getConsumer(): Consumer<T> {
    return this.internalReactContext.Consumer;
  }

  /**
   * Utility getter.
   * Allows to get related React.Provider for manual renders.
   */
  public getProvider(): ComponentType {
    return ContextManager.getObserver(this);
  }

  /**
   * Force React.Provider update.
   * Calls lifecycle methods.
   * Should not cause odd renders because affects only related React.Provider elements (commonly - 1 per store).
   */
  public update(): void {

    this.beforeUpdate();
    this.observedElements.forEach((it) => it.setState(this.getProvidedProps()));
    this.afterUpdate();
  }

  // todo: Set context?

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
   */
  protected beforeUpdate(): void {}
  protected afterUpdate(): void {}

  /**
   * Get provided context object.
   * Spread object every time for new references and provider HOC update.
   * It will not force consumers/React.Provider odd renders because actions/state nested objects will be separated.
   */
  private getProvidedProps(): T {
    return Object.assign({}, this.context);
  }

}

/**
 * Decorator factory.
 * Modifies method descriptor, so it will be bound to prototype instance once.
 * All credits: 'https://www.npmjs.com/package/autobind-decorator'.
 */
export const Bind = <T>(target: (...args: Array<any>) => any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

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
