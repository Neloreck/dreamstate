import { mount } from "enzyme";
import { createElement, ReactElement } from "react";

import { useManager } from "@/dreamstate/core/consumption/useManager";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { TAnyContextManagerConstructor } from "@/dreamstate/types";

function testManagers(first: TAnyContextManagerConstructor, second: TAnyContextManagerConstructor): void {
  function FirstConsumer(): ReactElement {
    const context = useManager(first);

    return createElement("div", {}, JSON.stringify(context));
  }

  function SecondConsumer(): ReactElement {
    const context = useManager(second);

    return createElement("div", {}, JSON.stringify(context));
  }

  expect(mount(createElement(FirstConsumer)).render()).toMatchSnapshot();
  expect(mount(createElement(SecondConsumer)).render()).toMatchSnapshot();
}

describe("ContextManager class default states", () => {
  it("should supply null values by default", () => {
    class First extends ContextManager {}

    class Second extends First {}

    testManagers(First, Second);
  });

  it("should supply default value if manager is not provided from static method, but handled in child", () => {
    class First extends ContextManager {}

    class Second extends First {

      public static getDefaultContext() {
        return { a: 1 };
      }

    }

    testManagers(First, Second);
  });

  it("should supply default value if manager is not provided from static method", () => {
    class First extends ContextManager {

      public static getDefaultContext() {
        return { a: 1 };
      }

    }

    class Second extends First {}

    testManagers(First, Second);
  });

  it("should supply default value from extended class method", () => {
    class First extends ContextManager<{ a: number }> {

      public static getDefaultContext() {
        return { a: 1 };
      }

    }

    class Second extends First {

      public static getDefaultContext() {
        return { a: 523 };
      }

    }

    testManagers(First, Second);
  });
});
