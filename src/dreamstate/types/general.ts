export interface IStringIndexed<T> {
  [index: string]: T;
}

export type TConstructor<T> = {
  new (...args: unknown[]): T;
};

export type TCallable = () => void;

export type TAnyObject = Record<string, any>;
