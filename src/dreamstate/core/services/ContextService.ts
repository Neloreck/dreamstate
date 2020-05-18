import { queryData } from "@/dreamstate/core/queries/queryData";
import { emitSignal } from "@/dreamstate/core/signals/emitSignal";
import {
  IOptionalQueryRequest,
  ISignal,
  TDreamstateService,
  TQueryType,
  TSignalType
} from "@/dreamstate/types";

export abstract class ContextService {

  /**
   * Should core destroy store instance after observers removal or preserve it for application lifespan.
   * Singleton objects will never be destroyed once created.
   * Non-singleton objects are destroyed if all observers are removed.
   */
  protected static IS_SINGLE: boolean = false;

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
  protected emitSignal<D = undefined, T extends TSignalType = TSignalType>(baseSignal: ISignal<D, T>): void {
    emitSignal(baseSignal, this.constructor as TDreamstateService);
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

}
