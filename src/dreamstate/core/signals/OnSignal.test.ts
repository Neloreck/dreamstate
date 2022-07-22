import { ContextManager, DreamstateError } from "@/dreamstate";
import { SIGNAL_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import { OnSignal } from "@/dreamstate/core/signals/OnSignal";
import { mockManager } from "@/dreamstate/test-utils";
import { TSignalSubscriptionMetadata, TSignalType } from "@/dreamstate/types";
import { ESignal, SubscribedManager } from "@/fixtures/signals";

describe("@OnSignal metadata decorator", () => {
  it("Signal decorator should properly add metadata", () => {
    const manager: SubscribedManager = mockManager(SubscribedManager);
    const signalListenersList: TSignalSubscriptionMetadata = manager[SIGNAL_METADATA_SYMBOL];

    expect(signalListenersList).toBeInstanceOf(Array);
    expect(signalListenersList).toHaveLength(3);

    expect(signalListenersList).toBeInstanceOf(Array);
    expect(signalListenersList[0]).toHaveLength(2);
    expect(signalListenersList[1]).toBeInstanceOf(Array);
    expect(signalListenersList[1]).toHaveLength(2);
    expect(signalListenersList[2]).toBeInstanceOf(Array);
    expect(signalListenersList[2]).toHaveLength(2);

    const [ firstMethod, firstSubscribed ] = signalListenersList[0];

    expect(firstMethod).toBe("onNumberSignal");
    expect(firstSubscribed).toBe(ESignal.NUMBER_SIGNAL);

    const [ secondMethod, secondSubscribed ] = signalListenersList[1];

    expect(secondMethod).toBe("onStringSignal");
    expect(secondSubscribed).toHaveLength(1);
    expect((secondSubscribed as Array<TSignalType>).includes(ESignal.STRING_SIGNAL)).toBeTruthy();

    const [ thirdMethod, thirdSubscribed ] = signalListenersList[2];

    expect(thirdMethod).toBe("onStringOrNumberSignal");
    expect(thirdSubscribed).toHaveLength(2);
    expect((thirdSubscribed as Array<TSignalType>).includes(ESignal.STRING_SIGNAL)).toBeTruthy();
    expect((thirdSubscribed as Array<TSignalType>).includes(ESignal.NUMBER_SIGNAL)).toBeTruthy();
  });

  it("Should not work with non-context service classes and bad queries", () => {
    const createTestedClass = <T>(signalType: T) => {
      class Manager extends ContextManager {

        @OnSignal(signalType as any)
        private willWork(): void {}

      }

      return Manager;
    };

    /**
     * Should extend base class.
     */
    expect(() => {
      class Custom {

        @OnSignal("WILL_NOT_WORK")
        private willNotWork(): void {}

      }
    }).toThrow(DreamstateError);

    expect(() => createTestedClass(undefined)).toThrow(DreamstateError);
    expect(() => createTestedClass(null)).toThrow(DreamstateError);
    expect(() => createTestedClass({})).toThrow(DreamstateError);
    expect(() => createTestedClass(new Map())).toThrow(DreamstateError);
    expect(() => createTestedClass(new Error())).toThrow(DreamstateError);
    expect(() => createTestedClass(void 0)).toThrow(DreamstateError);
    expect(() => createTestedClass([])).toThrow(DreamstateError);
    expect(() => createTestedClass([ undefined ])).toThrow(DreamstateError);
    expect(() => createTestedClass([ null ])).toThrow(DreamstateError);
    expect(() => createTestedClass([ {} ])).toThrow(DreamstateError);
    expect(() => createTestedClass([ 123 ])).not.toThrow(DreamstateError);
    expect(() => createTestedClass([ 123, "TEST" ])).not.toThrow(DreamstateError);
    expect(() => createTestedClass([ 123, "TEST", Symbol("CHECK") ])).not.toThrow(DreamstateError);
    expect(() => createTestedClass([ Symbol.for("TEST_EXAMPLE"), "TEST" ])).not.toThrow(DreamstateError);
  });
});
