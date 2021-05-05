import { Suite } from "benchmark";

import { TAnyObject } from "@/dreamstate/types";

const normalMap = new Map();
const weakMap = new WeakMap();
const objectDictionary: Record<string, any> = {};
const nullPrototypeDictionary: Record<string, any> = Object.create(null);

const stringKey: string = "key";
const objectKey: TAnyObject = {};
const value: TAnyObject = {};

normalMap.set(stringKey, value);
objectDictionary[stringKey] = value;
nullPrototypeDictionary[stringKey] = value;

normalMap.set(objectKey, value);
weakMap.set(objectKey, value);

export const suite = new Suite()
  .add("access#string+normal map", () => {
    const value = normalMap.get(stringKey);
  })
  .add("access#string+object dictionary", () => {
    const value = objectDictionary[stringKey];
  })
  .add("access#string+null proto object", () => {
    const value = nullPrototypeDictionary[stringKey];
  })
  .add("access#object + normal map", () => {
    const value = normalMap.get(objectKey);
  })
  .add("access#object + weak map", () => {
    const value = weakMap.get(objectKey);
  });
