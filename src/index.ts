import * as React from "react";
import { createContext, ComponentType, Context, Consumer } from "react";
import { default as OriginalBind} from "autobind-decorator";

export const Bind = () => OriginalBind;

/*
 * Decorator.
 * Provide context from context manager.
 * Observes changes and uses default react Provider.
 */
export const Provide =
  (...managers: Array<ReactContextManager<any>>) => <ComponentTargetType extends ComponentType<any>>(target: ComponentTargetType) => {

    let element!: ComponentType;

    for (const manager of managers) {

      const scopedElement = element || target;

      element = (renderProps: any) => React.createElement(manager.getProvider(), renderProps, React.createElement(scopedElement, renderProps));
    }

    return element as any;
  };

/*
 * Decorator.
 * Consumes context from context manager.
 * Observes changes and uses default react Provider.
 */
export const Consume =
  (...managers: Array<ReactContextManager<any>>) =>
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
export abstract class ReactContextManager<T extends object> {

  public static getSetter = <S extends object, D extends keyof S>(manager: ReactContextManager<S>, key: D) => {

    return (obj: Partial<S[D]>) => {
      manager.beforeUpdate();
      manager.context[key] = { ...(manager.context as any)[key], ...(obj as object) };
      manager.observedElements.forEach((it) => it.forceUpdate());
      manager.afterUpdate();
    };
  };

  private static getObserver = (parent: ReactContextManager<any>) => (
    class extends React.PureComponent {

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

      public render(): JSX.Element {
        return React.createElement(parent.providedContext.Provider,  { value: parent.getProvidedProps() }, this.props.children);
      }
    }
  );

  private readonly providedContext: Context<T>;
  protected observedElements: Array<any> = [];
  protected abstract context: T;

  public constructor() {
    this.providedContext = createContext(this.getProvidedProps());
  }

  public getConsumer(): Consumer<T> {
    return this.providedContext.Consumer;
  }

  public getProvider() {
    return ReactContextManager.getObserver(this);
  }

  public update(): void {
    this.beforeUpdate();
    this.observedElements.forEach((it) => it.forceUpdate());
    this.afterUpdate();
  }

  protected onProvisionStarted(): void {}
  protected onProvisionEnded(): void {}

  protected beforeUpdate(): void {}
  protected afterUpdate(): void {}


  private getProvidedProps(): T {
    // @ts-ignore
    return { ...this.context };
  }

}
