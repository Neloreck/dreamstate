/*
 * 'https://github.com/Neloreck/dreamstate'
 */

export { IProviderProps as ProviderProps } from "@/dreamstate/types/provision";
export {
  ILoadable as Loadable,
  TNested as Nested,
  TComputed as Computed,
  ISignalEvent as SignalEvent,
  TDerivedSignal as Signal,
  TSignalType as SignalType,
  TQueryResponse as QueryResponse,
  TOptionalQueryResponse as OptionalQueryResponse,
  TQueryRequest as QueryRequest,
  TQueryType as QueryType,
  IContextManagerConstructor as ContextManagerConstructor,
  TManagerMap as ManagerMap,
  TManagerInstanceMap as ManagerInstanceMap,
  EDreamstateErrorCode as DreamstateErrorCode
} from "@/dreamstate/types";

export { DreamstateError } from "@/dreamstate/core/error/DreamstateError";

export { ContextManager } from "@/dreamstate/core/services/ContextManager";
export { createProvider } from "@/dreamstate/core/provision/createProvider";
export { useManager } from "@/dreamstate/core/consumption/useManager";

export { OnSignal } from "@/dreamstate/core/signals/OnSignal";
export { OnQuery } from "@/dreamstate/core/queries/OnQuery";

export { IScopeContext as ScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
export { ScopeProvider } from "@/dreamstate/core/scoping/ScopeProvider";
export { useScope } from "@/dreamstate/core/scoping/useScope";

export { Bind } from "@/dreamstate/utils/Bind";
export { createLoadable } from "@/dreamstate/utils/createLoadable";
export { createNested } from "@/dreamstate/utils/createNested";
export { createComputed } from "@/dreamstate/utils/createComputed";
export { createActions } from "@/dreamstate/utils/createActions";
