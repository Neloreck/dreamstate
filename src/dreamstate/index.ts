/*
 * 'https://github.com/Neloreck/dreamstate'
 */

export { IProviderProps as ProviderProps } from "@/dreamstate/types/provision";
export {
  EDreamstateErrorCode as DreamstateErrorCode,
  IContextManagerConstructor as ContextManagerConstructor,
  ILoadable as Loadable,
  ISignalEvent as SignalEvent,
  TComputed as Computed,
  TDerivedSignal as Signal,
  TManagerInstanceMap as ManagerInstanceMap,
  TManagerMap as ManagerMap,
  TNested as Nested,
  TOptionalQueryResponse as OptionalQueryResponse,
  TPartialTransformer as PartialTransformer,
  TQueryRequest as QueryRequest,
  TQueryResponse as QueryResponse,
  TQueryType as QueryType,
  TSignalType as SignalType
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
