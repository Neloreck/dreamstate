import { TConstructor } from "./general";

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