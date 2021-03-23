import { ISignalEvent, TSignalType } from "@/dreamstate/types";

export function cancelSignal(this: ISignalEvent<TSignalType, unknown>) {
  this.canceled = true;
}
