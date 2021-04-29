import { queryData } from "@/dreamstate/core/queries/queryData";
import { queryDataSync } from "@/dreamstate/core/queries/queryDataSync";
import { emitSignal } from "@/dreamstate/core/signals/emitSignal";
import {
  IBaseSignal,
  IOptionalQueryRequest,
  TAnyObject,
  TDreamstateService,
  TQueryType,
  TSignalType
} from "@/dreamstate/types";

export abstract class ContextService<S extends TAnyObject = TAnyObject> {

  public constructor(initialState?: S) {
  }

  /**
   * Lifecycle.
   * First provider was injected into DOM.
   */
  protected onProvisionStarted(): void {}

  /**
   * Lifecycle.
   * Last provider was removed from DOM.
   */
  protected onProvisionEnded(): void {}

  /**
   * Emit signal for other managers and subscribers.
   */
  protected emitSignal<T extends TSignalType = TSignalType, D = undefined>(
    baseSignal: IBaseSignal<T, D>
  ): Promise<void> {
    return emitSignal(baseSignal, this.constructor as TDreamstateService<S>);
  }

  /**
   * Send context query to retrieve data from @OnQuery method with required types.
   */
  protected queryData<
    D extends any,
    T extends TQueryType,
    Q extends IOptionalQueryRequest<D, T> | Array<IOptionalQueryRequest>
    >(
    queryRequest: Q
  ) {
    return queryData<any, D, T, Q>(queryRequest);
  }

  /**
   * Send sync context query to retrieve data from @OnQuery method with required types.
   */
  protected queryDataSync<
    D extends any,
    T extends TQueryType,
    Q extends IOptionalQueryRequest<D, T>
    >(
    queryRequest: Q
  ) {
    return queryDataSync<any, D, T, Q>(queryRequest);
  }

}
