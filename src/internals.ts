declare const IS_DEV: boolean;

export const EMPTY_STRING: string = "";
export const EMPTY_ARR: Array<never> = [];
export const MANAGER_REGEX: RegExp = /Manager$/;

export const IDENTIFIER_KEY: unique symbol = Symbol(IS_DEV ? "DS_ID" : "");
export const MUTABLE_KEY: unique symbol = Symbol(IS_DEV ? "DS_MUTABLE" : "");
export const SIGNAL_LISTENER_KEY: unique symbol = Symbol(IS_DEV ? "DS_SG_SUBSCRIBER" : "");
