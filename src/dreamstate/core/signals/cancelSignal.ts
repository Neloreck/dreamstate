import { ISignalEvent } from "@/dreamstate/types";

export function cancelSignal(this: ISignalEvent) {
  this.canceled = true;
}
