/*
 * 'https://github.com/Neloreck/dreamstate'
 */

import {
  ContextManager as DContextManager,
  createProvider as DcreateProvider,
  ScopeProvider as DScopeProvider,
  useScope as DuseScope,
  OnSignal as DOnSignal,
  OnQuery as DOnQuery,
  useManager as DuseManager,
  Bind as DBind,
  createLoadable as DcreateLoadable,
  createNested as DcreateNested,
  createComputed as DcreateComputed,
  createActions as DcreateActions,
  DreamstateErrorCode as DDreamstateErrorCode,
  DreamstateError as DDreamstateError
} from "./development";
import {
  ContextManager as PContextManager,
  createProvider as PcreateProvider,
  ScopeProvider as PScopeProvider,
  useScope as PuseScope,
  OnSignal as POnSignal,
  OnQuery as POnQuery,
  useManager as PuseManager,
  Bind as PBind,
  createLoadable as PcreateLoadable,
  createNested as PcreateNested,
  createComputed as PcreateComputed,
  createActions as PcreateActions,
  DreamstateErrorCode as PDreamstateErrorCode,
  DreamstateError as PDreamstateError
} from "./production";

export const DreamstateErrorCode = process.env.NODE_ENV === "production" ? PDreamstateErrorCode : DDreamstateErrorCode;
export const DreamstateError = process.env.NODE_ENV === "production" ? PDreamstateError : DDreamstateError;

export const ContextManager = process.env.NODE_ENV === "production" ? PContextManager : DContextManager;
export const useManager = process.env.NODE_ENV === "production" ? PuseManager : DuseManager;

export const createProvider = process.env.NODE_ENV === "production" ? PcreateProvider : DcreateProvider;
export const ScopeProvider = process.env.NODE_ENV === "production" ? PScopeProvider : DScopeProvider;
export const useScope = process.env.NODE_ENV === "production" ? PuseScope : DuseScope;

export const OnSignal = process.env.NODE_ENV === "production" ? POnSignal : DOnSignal;
export const OnQuery = process.env.NODE_ENV === "production" ? POnQuery : DOnQuery;

export const Bind = process.env.NODE_ENV === "production" ? PBind : DBind;
export const createLoadable = process.env.NODE_ENV === "production" ? PcreateLoadable : DcreateLoadable;
export const createNested = process.env.NODE_ENV === "production" ? PcreateNested : DcreateNested;
export const createComputed = process.env.NODE_ENV === "production" ? PcreateComputed : DcreateComputed;
export const createActions = process.env.NODE_ENV === "production" ? PcreateActions : DcreateActions;
