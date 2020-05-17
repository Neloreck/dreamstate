/*
 * 'https://github.com/Neloreck/dreamstate'
 */

import {
  ContextService as DContextService,
  ContextManager as DContextManager,
  getCurrentContext as DgetCurrentContext,
  getCurrent as DgetCurrent,
  createProvider as DcreateProvider,
  Provide as DProvide,
  withProvision as DPwithProvision,
  OnSignal as DOnSignal,
  useSignals as DuseSignals,
  unsubscribeFromSignals as DunsubscribeFromSignals,
  subscribeToSignals as DsubscribeToSignals,
  emitSignal as DemitSignal,
  OnQuery as DOnQuery,
  useManager as DuseManager,
  Consume as DConsume,
  withConsumption as DwithConsumption,
  Bind as DBind,
  createLoadable as DcreateLoadable,
  createMutable as DcreateMutable,
  createSetter as DcreateSetter
} from "./development";
import {
  ContextService as PContextService,
  ContextManager as PContextManager,
  getCurrentContext as PgetCurrentContext,
  getCurrent as PgetCurrent,
  createProvider as PcreateProvider,
  Provide as PProvide,
  withProvision as PwithProvision,
  OnSignal as POnSignal,
  useSignals as PuseSignals,
  unsubscribeFromSignals as PunsubscribeFromSignals,
  subscribeToSignals as PsubscribeToSignals,
  emitSignal as PemitSignal,
  OnQuery as POnQuery,
  useManager as PuseManager,
  Consume as PConsume,
  withConsumption as PwithConsumption,
  Bind as PBind,
  createLoadable as PcreateLoadable,
  createMutable as PcreateMutable,
  createSetter as PcreateSetter
} from "./production";

export const ContextService = process.env.NODE_ENV === "production" ? PContextService : DContextService;
export const ContextManager = process.env.NODE_ENV === "production" ? PContextManager : DContextManager;

export const getCurrentContext = process.env.NODE_ENV === "production" ? PgetCurrentContext : DgetCurrentContext;
export const getCurrent = process.env.NODE_ENV === "production" ? PgetCurrent : DgetCurrent;

export const createProvider = process.env.NODE_ENV === "production" ? PcreateProvider : DcreateProvider;
export const Provide = process.env.NODE_ENV === "production" ? PProvide : DProvide;
export const withProvision = process.env.NODE_ENV === "production" ? PwithProvision : DPwithProvision;

export const OnSignal = process.env.NODE_ENV === "production" ? POnSignal : DOnSignal;
export const useSignals = process.env.NODE_ENV === "production" ? PuseSignals : DuseSignals;
export const unsubscribeFromSignals = process.env.NODE_ENV === "production"
  ? PunsubscribeFromSignals
  : DunsubscribeFromSignals;
export const subscribeToSignals = process.env.NODE_ENV === "production" ? PsubscribeToSignals : DsubscribeToSignals;
export const emitSignal = process.env.NODE_ENV === "production" ? PemitSignal : DemitSignal;

export const OnQuery = process.env.NODE_ENV === "production" ? POnQuery : DOnQuery;

export const useManager = process.env.NODE_ENV === "production" ? PuseManager : DuseManager;
export const Consume = process.env.NODE_ENV === "production" ? PConsume : DConsume;
export const withConsumption = process.env.NODE_ENV === "production" ? PwithConsumption : DwithConsumption;

export const Bind = process.env.NODE_ENV === "production" ? PBind : DBind;
export const createLoadable = process.env.NODE_ENV === "production" ? PcreateLoadable : DcreateLoadable;
export const createMutable = process.env.NODE_ENV === "production" ? PcreateMutable : DcreateMutable;
export const createSetter = process.env.NODE_ENV === "production" ? PcreateSetter : DcreateSetter;
