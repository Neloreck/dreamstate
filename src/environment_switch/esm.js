/*
 * 'https://github.com/Neloreck/dreamstate'
 */

import {
  ContextManager as DContextManager,
  createProvider as DcreateProvider,
  OnSignal as DOnSignal,
  useSignals as DuseSignals,
  unsubscribeFromSignals as DunsubscribeFromSignals,
  subscribeToSignals as DsubscribeToSignals,
  emitSignal as DemitSignal,
  OnQuery as DOnQuery,
  queryData as DqueryData,
  queryDataSync as DqueryDataSync,
  registerQueryProvider as DregisterQueryProvider,
  unRegisterQueryProvider as DunRegisterQueryProvider,
  useManager as DuseManager,
  Bind as DBind,
  createLoadable as DcreateLoadable,
  createNested as DcreateNested,
  createComputed as DcreateComputed,
  createActions as DcreateActions
} from "./development";
import {
  ContextManager as PContextManager,
  createProvider as PcreateProvider,
  OnSignal as POnSignal,
  useSignals as PuseSignals,
  unsubscribeFromSignals as PunsubscribeFromSignals,
  subscribeToSignals as PsubscribeToSignals,
  emitSignal as PemitSignal,
  OnQuery as POnQuery,
  queryData as PqueryData,
  queryDataSync as PqueryDataSync,
  registerQueryProvider as PregisterQueryProvider,
  unRegisterQueryProvider as PunRegisterQueryProvider,
  useManager as PuseManager,
  Bind as PBind,
  createLoadable as PcreateLoadable,
  createNested as PcreateNested,
  createComputed as PcreateComputed,
  createActions as PcreateActions
} from "./production";

export const ContextManager = process.env.NODE_ENV === "production" ? PContextManager : DContextManager;

export const createProvider = process.env.NODE_ENV === "production" ? PcreateProvider : DcreateProvider;

export const OnSignal = process.env.NODE_ENV === "production" ? POnSignal : DOnSignal;
export const useSignals = process.env.NODE_ENV === "production" ? PuseSignals : DuseSignals;
export const unsubscribeFromSignals = process.env.NODE_ENV === "production"
  ? PunsubscribeFromSignals
  : DunsubscribeFromSignals;
export const subscribeToSignals = process.env.NODE_ENV === "production" ? PsubscribeToSignals : DsubscribeToSignals;
export const emitSignal = process.env.NODE_ENV === "production" ? PemitSignal : DemitSignal;

export const OnQuery = process.env.NODE_ENV === "production" ? POnQuery : DOnQuery;
export const queryData = process.env.NODE_ENV === "production" ? PqueryData : DqueryData;
export const queryDataSync = process.env.NODE_ENV === "production" ? PqueryDataSync : DqueryDataSync;
export const registerQueryProvider = process.env.NODE_ENV === "production"
  ? PregisterQueryProvider
  : DregisterQueryProvider;
export const unRegisterQueryProvider = process.env.NODE_ENV === "production" ?
  PunRegisterQueryProvider
  : DunRegisterQueryProvider;

export const useManager = process.env.NODE_ENV === "production" ? PuseManager : DuseManager;

export const Bind = process.env.NODE_ENV === "production" ? PBind : DBind;
export const createLoadable = process.env.NODE_ENV === "production" ? PcreateLoadable : DcreateLoadable;
export const createNested = process.env.NODE_ENV === "production" ? PcreateNested : DcreateNested;
export const createComputed = process.env.NODE_ENV === "production" ? PcreateComputed : DcreateComputed;
export const createActions = process.env.NODE_ENV === "production" ? PcreateActions : DcreateActions;
