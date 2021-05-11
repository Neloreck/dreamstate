import { Suite } from "benchmark";

import { TAnyObject, TNested } from "@/dreamstate/types";

class TestEmptyStore {
}

/**
 * Util for nested stores immutable merging.
 */
function asMerged<T>(
  this: TNested<T>,
  state: Partial<T> = {}
): TNested<T> {
  return Object.assign(new TestEmptyStore(), this, state);
}

function createEmptyStore<T extends TAnyObject>(state: T): TNested<T> {
  return Object.assign(new TestEmptyStore(), state, { asMerged: asMerged as any });
}

class TestStoreWithMethod<T> {

  public state: T;

  public constructor(state: T) {
    this.state = state;
  }

  public asMerged(state: T): TestStoreWithMethod<T> {
    return new TestStoreWithMethod<T>(state);
  }

}

class TestWithAssigningConstructor<T> {

  public asMerged(state: T): TestWithAssigningConstructor<T> {
    return Object.assign(new TestWithAssigningConstructor<T>(), this, state);
  }

}

const empty = createEmptyStore({ test: "test" });
const withMethod = new TestStoreWithMethod({ test: "test" });
const withAssign = Object.assign(new TestWithAssigningConstructor(), { test: "test" });

export const suite = new Suite()
  .add("create#functional", () => {
    const value = createEmptyStore({ test: "test" });
  })
  .add("mutate#functional", () => {
    const value = empty.asMerged({ test: "another" });
  })
  .add("create#class-method", () => {
    const value = new TestStoreWithMethod({ test: "test" });
  })
  .add("mutate#class-method", () => {
    const value = withMethod.asMerged({ test: "another" });
  })
  .add("create#class-semi-assign", () => {
    const value = Object.assign(new TestWithAssigningConstructor(), { test: "test" });
  })
  .add("mutate#class-semi-assign", () => {
    const value = withAssign.asMerged({ test: "another" });
  });

