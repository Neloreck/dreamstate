import { SignalEvent } from "dreamstate";

export enum EGenericSignal {
  SAMPLE_NUMBER_CHANGED = "SAMPLE_NUMBER_CHANGED",
  SAMPLE_STRING_CHANGED = "SAMPLE_STRING_CHANGED",
}

export type TSampleNumberChangedSignalEvent = SignalEvent<number>;

export type TSampleStringChangedSignalEvent = SignalEvent<string>;
