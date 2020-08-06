import { Suite } from "benchmark";

export const suite = new Suite()
  .add("RegExp#test", () => /o/.test("Hello World!"))
  .add("String#indexOf", () => "Hello World!".indexOf("o") > -1);
