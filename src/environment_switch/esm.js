/*
 * 'https://github.com/Neloreck/dreamstate'
 */

import {
  Bind as DBind,
  ContextManager as DContextManager,
  DreamstateError as DDreamstateError,
  DreamstateErrorCode as DDreamstateErrorCode,
  OnQuery as DOnQuery,
  OnSignal as DOnSignal,
  ScopeProvider as DScopeProvider,
  createActions as DcreateActions,
  createComputed as DcreateComputed,
  createLoadable as DcreateLoadable,
  createNested as DcreateNested,
  createProvider as DcreateProvider,
  createScope as DcreateScope,
  useManager as DuseManager,
  useScope as DuseScope,
} from "./development";
import {
  Bind as PBind,
  ContextManager as PContextManager,
  DreamstateError as PDreamstateError,
  DreamstateErrorCode as PDreamstateErrorCode,
  OnQuery as POnQuery,
  OnSignal as POnSignal,
  ScopeProvider as PScopeProvider,
  createActions as PcreateActions,
  createComputed as PcreateComputed,
  createLoadable as PcreateLoadable,
  createNested as PcreateNested,
  createProvider as PcreateProvider,
  createScope as PcreateScope,
  useManager as PuseManager,
  useScope as PuseScope,
} from "./production";

export const Bind = process.env.NODE_ENV === "production" ? PBind : DBind;
export const ContextManager = process.env.NODE_ENV === "production" ? PContextManager : DContextManager;
export const DreamstateError = process.env.NODE_ENV === "production" ? PDreamstateError : DDreamstateError;
export const DreamstateErrorCode = process.env.NODE_ENV === "production" ? PDreamstateErrorCode : DDreamstateErrorCode;
export const OnQuery = process.env.NODE_ENV === "production" ? POnQuery : DOnQuery;
export const OnSignal = process.env.NODE_ENV === "production" ? POnSignal : DOnSignal;
export const ScopeProvider = process.env.NODE_ENV === "production" ? PScopeProvider : DScopeProvider;
export const createActions = process.env.NODE_ENV === "production" ? PcreateActions : DcreateActions;
export const createComputed = process.env.NODE_ENV === "production" ? PcreateComputed : DcreateComputed;
export const createLoadable = process.env.NODE_ENV === "production" ? PcreateLoadable : DcreateLoadable;
export const createNested = process.env.NODE_ENV === "production" ? PcreateNested : DcreateNested;
export const createProvider = process.env.NODE_ENV === "production" ? PcreateProvider : DcreateProvider;
export const createScope = process.env.NODE_ENV === "production" ? PcreateScope : DcreateScope;
export const useManager = process.env.NODE_ENV === "production" ? PuseManager : DuseManager;
export const useScope = process.env.NODE_ENV === "production" ? PuseScope : DuseScope;
