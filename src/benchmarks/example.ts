import { Suite } from "benchmark";

export const suite = new Suite();

suite
  .add("RegExp#test", () => /o/.test("Hello World!"))
  .add("String#indexOf", () => "Hello World!".indexOf("o") > -1)
  .on("cycle", (event: Event) => console.log(String(event.target)))
  .on("complete", function(this: Suite) {
    console.log("Fastest is " + this.filter("fastest").map("name" as any));
  });
