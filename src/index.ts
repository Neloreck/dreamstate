import { default as OriginalBind} from "autobind-decorator";
import * as React from "react";
import { createContext, Component, ComponentType, Context, Consumer, ReactNode } from "react";

/*
 * ±1.4KB min+gzip, only pure react codebase usage.
 *
 * 'https://github.com/Neloreck/dreamstate'
 *
 * OOP style context store for react.
 * Reactivity, lifecycle, strict TS typing, dependency injection + singleton pattern for each application store without boilerplate code.
 */

/*
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

/*
 * Decorator factory.
 * Provide context from context manager.
 * Observes changes and uses default react Provider for data flow.
 */
export const Provide =
  (...managers: Array<ContextManager<any>>) => <ComponentTargetType extends ComponentType<any>>(target: ComponentTargetType) => {

    let element!: ComponentType;

    for (const manager of managers) {

      const scopedElement = element || target;

      element = (renderProps: any) => React.createElement(manager.getProvider(), renderProps, React.createElement(scopedElement, renderProps));
    }

    return element as any;
  };

/*
 * Decorator factory.
 * Consumes context from context manager.
 * Observes changes and uses default react Provider.
 */
export const Consume =
  (...managers: Array<ContextManager<any>>) =>
    <ComponentTargetType> (target: ComponentTargetType) => {

      let element!: ComponentType;

      for (const manager of managers) {

        const scopedElement = element || target;

        element = ((renderProps: object) => React.createElement(
          manager.getConsumer() as any,
          null,
          (contextProps: object) => React.createElement(scopedElement, { ...renderProps, ...contextProps }))) as any
      }

      return element as any;
    };

/*
 * Abstract class.
 * Class based context manager for react.
 * Current Issue: Static items inside of each class instance.
 */
export abstract class ContextManager<T extends object> {

  /*
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

  /*
   * Observer factory for react providers.
   * Allows to use lifecycle and observer pattern.
   */
  private static getObserver = (parent: ContextManager<any>): ComponentType => (

    class extends Component {

      state = parent.getProvidedProps();

      shouldComponentUpdate(nextProps: any, nextState: Readonly<{[index: string]: object}>): boolean {
        return Object.keys(this.state).some((key: string): boolean => !shallowEqualObjects(this.state[key], nextState[key]));
      }

      public componentWillMount(): void {

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
        return React.createElement(parent.providedContext.Provider,  { value: this.state }, this.props.children);
      }
    }
  );

  /*
   * Array of provider observers.
   * Used for one app-level supply or for separate react dom sub-trees injection.
   */
  protected observedElements: Array<any> = [];

  /*
   * Abstract store/actions bundle.
   * Left for generic implementation.
   */
  protected abstract context: T;

  /*
   * React Context<T> store internal.
   */
  private readonly providedContext: Context<T>;

  /*
   * Default constructor.
   * Allows to create react context provider/consumer bundle.
   * Stores it as private readonly singleton per each storage.
   */
  public constructor() {
    this.providedContext = createContext(this.getProvidedProps());
  }

  /*
   * Utility getter.
   * Allows to get related React.Consumer for manual renders.
   */
  public getConsumer(): Consumer<T> {
    return this.providedContext.Consumer;
  }

  /*
   * Utility getter.
   * Allows to get related React.Provider for manual renders.
   */
  public getProvider() {
    return ContextManager.getObserver(this);
  }

  /*
   * Force React.Provider update.
   * Calls lifecycle methods.
   * Should not cause odd renders because affects only related React.Provider elements (commonly - 1 per store).
   */
  public update(): void {

    this.beforeUpdate();
    this.observedElements.forEach((it) => it.setState(this.getProvidedProps()));
    this.afterUpdate();
  }

  /*
   * Lifecycle.
   * First provider was injected into DOM / Last provider was removed from DOM.
   */
  protected onProvisionStarted(): void {}
  protected onProvisionEnded(): void {}

  /*
   * Lifecycle.
   * Before/after manual update lifecycle event.
   * Also shares for 'getSetter' methods.
   */
  protected beforeUpdate(): void {}
  protected afterUpdate(): void {}

  /*
   * Get provided context object.
   * Spread object every time for new references and provider HOC update.
   * It will not force consumers/React.Provider odd renders because actions/state nested objects will be separated.
   */
  private getProvidedProps(): T {
    return { ...this.context };
  }

}

/*
 * Decorator factory.
 * Modifies method descriptor, so it will be bound to prototype instance once.
 * All credits: 'https://www.npmjs.com/package/autobind-decorator'.
 */
export const Bind = () => OriginalBind;
