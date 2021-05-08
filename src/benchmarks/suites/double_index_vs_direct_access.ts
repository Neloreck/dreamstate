import { Suite } from "benchmark";

const times: number = 5000;

const value = {
  nested: {
    first: "first",
    second: "second"
  },
  another: "another"
};

const nestedLink = value.nested;

export const suite = new Suite()
  .add("access#direct", () => {
    let current: string = "default";

    for (let it = 0; it < times; it ++) {
      current = nestedLink["first"];
    }

    return current;
  })
  .add("access#double_index", () => {
    let current: string = "default";

    for (let it = 0; it < times; it ++) {
      current = value["nested"]["first"];
    }

    return current;
  })
  .add("access#single_index", () => {
    let current: string = "default";

    for (let it = 0; it < times; it ++) {
      current = value["another"];
    }

    return current;
  })
  .add("access#single_dot_access", () => {
    let current: string = "default";

    for (let it = 0; it < times; it ++) {
      current = value.another;
    }

    return current;
  })
  .add("access#double_dot_access", () => {
    let current: string = "default";

    for (let it = 0; it < times; it ++) {
      current = value.nested.first;
    }

    return current;
  });
