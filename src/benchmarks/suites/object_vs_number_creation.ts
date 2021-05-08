import { Suite } from "benchmark";

const times: number = 25;

export const suite = new Suite()
  .add("object_creation", () => {
    let value: Record<string, any> = {};

    for (let it = 0; it < times; it += 1) {
      value = {};
    }
  })
  .add("null_object_creation", () => {
    let value: Record<string, any> = {};

    for (let it = 0; it < times; it += 1) {
      value = Object.create(null);
    }
  })
  .add("number_increment+offset", () => {
    let value: number = 5;

    for (let it = 0; it < times; it += 1) {
      value = (value + 1) % 10;
    }
  });
