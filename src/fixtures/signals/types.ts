import { ISignalEvent } from "@/dreamstate/types";
import { ESignal } from "@/fixtures/signals/ESignal";

export type TStringSignalEvent = ISignalEvent<string, ESignal.STRING_SIGNAL>;

export type TNumberSignalEvent = ISignalEvent<string, ESignal.NUMBER_SIGNAL>;
