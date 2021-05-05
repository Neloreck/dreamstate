import { Suite } from "benchmark";

const symbolKey: unique symbol = Symbol();
const stringKey: string = "str";
const numberKey: number = 0;

const sampleObject = {
  [numberKey]: {},
  [stringKey]: {},
  [symbolKey]: {}
};

export const suite = new Suite()
  .add("access#string-prop", () => {
    const value = sampleObject[stringKey];
  })
  .add("access#number-prop", () => {
    const value = sampleObject[numberKey];
  })
  .add("access#symbol-prop", () => {
    const value = sampleObject[symbolKey];
  })
  .add("access#direct-name", () => {
    const value = sampleObject.str;
  });
