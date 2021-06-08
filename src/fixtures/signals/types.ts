import { ISignalEvent } from "@/dreamstate/types";
import { ESignal } from "@/fixtures/signals/ESignal";

export type TStringSignalEvent = ISignalEvent<ESignal.STRING_SIGNAL>;

export type TNumberSignalEvent = ISignalEvent<ESignal.NUMBER_SIGNAL>;
