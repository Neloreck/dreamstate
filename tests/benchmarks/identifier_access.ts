import { Event, Suite } from "benchmark";

const testSuite: Suite = new Suite();
const key: any = Symbol();
const nestedKey: any = Symbol();

const nested = {
  [nestedKey]: key
};

const testObjectA = {
  [key]: 15
};

const testObjectB = {
  [key]: "1"
};

const testObjectC = {
  [key]: false
};

testSuite
  .add("Saved constant reference.", () => {
    const scoped: any = key;

    testObjectA[scoped];
    testObjectB[scoped];
    testObjectC[scoped];
  })
  .add("Each time access reference.", () => {
    testObjectA[nested[nestedKey]];
    testObjectB[nested[nestedKey]];
    testObjectC[nested[nestedKey]];
  })
  .on("complete", () => console.log("Fastest is " + testSuite.filter("fastest").map("name" as any)))
  .on("cycle", (event: Event) => console.log(String(event.target)))
  .run({ async: true });
