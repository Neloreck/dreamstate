import { queryData } from "@/dreamstate/core/queries/queryData";
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

  /**
   * Should core destroy store instance after observers removal or preserve it for application lifespan.
   * Singleton objects will never be destroyed once created.
   * Non-singleton objects are destroyed if all observers are removed.
   */
  protected static IS_SINGLE: boolean = false;

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
    R extends any,
    D extends any,
    T extends TQueryType,
    Q extends IOptionalQueryRequest<D, T> | Array<IOptionalQueryRequest>
    >(
    queryRequest: Q
  ) {
    return queryData<R, D, T, Q>(queryRequest);
  }

  /**
   * Send sync context query to retrieve data from @OnQuery method with required types.
   */
  protected queryDataSync<
    R extends any,
    D extends any,
    T extends TQueryType,
    Q extends IOptionalQueryRequest<D, T>
    >(
    queryRequest: Q
  ) {
    return queryData<R, D, T, Q>(queryRequest);
  }

}
