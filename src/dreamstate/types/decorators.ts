import { TConstructor } from "@/dreamstate/types/general";

/**
 * From the TC39 Decorators proposal.
 */
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface ClassElement {
  kind: "field" | "method";
  key: PropertyKey;
  placement: "static" | "prototype" | "own";
  initializer?: Function;
  extras?: ClassElement[];
  finisher?: <T>(clazz: TConstructor<T>) => void | undefined | TConstructor<T>;
  descriptor?: PropertyDescriptor;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface ClassDescriptor {
  kind: "class";
  elements: ClassElement[];
  finisher?: <T>(clazz: TConstructor<T>) => void | TConstructor<T>;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface MethodDescriptor extends ClassElement {
  kind: "method";
  descriptor: PropertyDescriptor;
}
