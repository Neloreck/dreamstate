import { Event, Suite } from "benchmark";
import { createElement, ReactElement, ReactNode } from "react";

function Tested(props: { children: ReactNode; value: number }): ReactElement {
  return createElement("div", {}, props.children, props.value);
}

const testSuite: Suite = new Suite();
const src = [ Tested, Tested, Tested, Tested, Tested, Tested, Tested, Tested, Tested, Tested, Tested ];

function provideSubTreeRecursive(
  current: number,
  bottom: ReactElement,
  sources: Array<any>
): ReactElement {
  return (
    current >= sources.length
      ? bottom
      : createElement(
        sources[current],
        { value: 1 } as any,
        provideSubTreeRecursive(current + 1, bottom, sources)
      )
  );
}

function provideSubTreeIterative(
  bottom: ReactElement,
  sources: Array<any>
): ReactElement {
  let acc: ReactElement = bottom;

  for (let it = sources.length - 1; it >= 0; it --) {
    acc = createElement(
      sources[it],
      { value: 1 } as any,
      acc
    );
  }

  return acc;
}

testSuite
  .add("Recursive impl.", () => {
    provideSubTreeRecursive(0, createElement("div", {}, 1), src);
  })
  .add("Iterative impl..", () => {
    provideSubTreeIterative(createElement("div", {}, 1), src);
  })
  .on("complete", () => console.log("Fastest is " + testSuite.filter("fastest").map("name" as any)))
  .on("cycle", (event: Event) => console.log(String(event.target)))
  .run({ "async": true });
