import { TAnyCallable, TAnyObject } from "@/dreamstate/types";

/**
 * Utility function to check whether the supplied parameter is a string.
 *
 * @param {unknown} target The parameter to check.
 * @returns {boolean} True if the parameter is a string, otherwise false.
 */
export function isString(target: unknown): target is string {
  return typeof target === "string";
}

/**
 * Utility function to check whether the supplied parameter is a number primitive.
 *
 * @param {unknown} target The parameter to check.
 * @returns {boolean} True if the parameter is a number, otherwise false.
 */
export function isNumber(target: unknown): target is number {
  return typeof target === "number";
}

/**
 * Utility function to check whether the supplied parameter is an object.
 *
 * @param {unknown} target The parameter to check.
 * @returns {boolean} True if the parameter is an object, otherwise false.
 */
export function isObject(target: unknown): target is TAnyObject {
  return typeof target === "object" && target !== null;
}

/**
 * Utility function to check whether the supplied parameter is a symbol.
 *
 * @param {unknown} target The parameter to check.
 * @returns {boolean} True if the parameter is a symbol, otherwise false.
 */
export function isSymbol(target: unknown): target is symbol {
  return typeof target === "symbol";
}

/**
 * Utility function to check whether the supplied parameter is a function.
 *
 * @param {unknown} target The parameter to check.
 * @returns {boolean} True if the parameter is a function, otherwise false.
 */
export function isFunction(target: unknown): target is TAnyCallable {
  return typeof target === "function";
}

/**
 * Utility function to check whether the supplied parameter is undefined.
 *
 * @param {unknown} target The parameter to check.
 * @returns {boolean} True if the parameter is undefined, otherwise false.
 */
export function isUndefined(target: unknown): target is undefined {
  return typeof target === "undefined";
}

/**
 * Check whether the provided type is correct for query usage.
 *
 * @param {unknown} type The provided type to check.
 * @returns {boolean} True if the provided type is valid for query usage, otherwise false.
 */
export function isCorrectQueryType(type: unknown): type is string | number | symbol {
  return isString(type) || isNumber(type) || isSymbol(type);
}

/**
 * Check whether the provided type is correct for signal usage.
 *
 * @param {unknown} type The provided type to check.
 * @returns {boolean} True if the provided type is valid for signal usage, otherwise false.
 */
export function isCorrectSignalType(type: unknown): type is string | number | symbol {
  return isString(type) || isNumber(type) || isSymbol(type);
}
