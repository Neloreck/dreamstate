import { Event, Suite } from "benchmark";

import { IDENTIFIER_KEY } from "@Lib/internals";

import { registerManagerClass, unRegisterManagerClass } from "@Tests/helpers";
import { TestContextManager } from "@Tests/assets";

const testSuite: Suite = new Suite();

testSuite
  .add("Direct indexed reference with lazy init.", () => TestContextManager[IDENTIFIER_KEY])
  .on("start", () => registerManagerClass(TestContextManager))
  .on("complete", () => unRegisterManagerClass(TestContextManager))
  .on("complete", () => console.log("Fastest is " + testSuite.filter("fastest").map("name" as any)))
  .on("cycle", (event: Event) => console.log(String(event.target)))
  .run({ async: true });
