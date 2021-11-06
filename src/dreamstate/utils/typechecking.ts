/**
 * Utility function to check whether supplied parameter is a string.
 *
 * @param {Object} target - parameter to check.
 * @returns {boolean} whether target parameter is a string.
 */
export function isString<T>(target: T): boolean {
  return typeof target === "string";
}

/**
 * Utility function to check whether supplied parameter is a number primitive.
 *
 * @param {Object} target - parameter to check.
 * @returns {boolean} whether target parameter is a number primitive.
 */
export function isNumber<T>(target: T): boolean {
  return typeof target === "number";
}

/**
 * Utility function to check whether supplied parameter is an object.
 *
 * @param {Object} target - parameter to check.
 * @returns {boolean} whether target parameter is an object.
 */
export function isObject<T>(target: T): boolean {
  return typeof target === "object" && target !== null;
}

/**
 * Utility function to check whether supplied parameter is a symbol.
 *
 * @param {Object} target - parameter to check.
 * @returns {boolean} whether target parameter is a symbol.
 */
export function isSymbol<T>(target: T): boolean {
  return typeof target === "symbol";
}

/**
 * Utility function to check whether supplied parameter is a function.
 *
 * @param {Object} target - parameter to check.
 * @returns {boolean} whether target parameter is a function.
 */
export function isFunction<T>(target: T): boolean {
  return typeof target === "function";
}

/**
 * Utility function to check whether supplied parameter is undefined.
 *
 * @param {Object} target - parameter to check.
 * @returns {boolean} whether target parameter is undefined.
 */
export function isUndefined<T>(target: T): boolean {
  return typeof target === "undefined";
}

/**
 * Check whether provided type is correct for query usage.
 *
 * @param type - provided type to check.
 * @returns {boolean} whether target parameter is a correct query type.
 */
export function isCorrectQueryType<T>(type: T): boolean {
  return isString(type) || isNumber(type) || isSymbol(type);
}

/**
 * Check whether provided type is correct for signals usage.
 *
 * @param type - provided type to check.
 * @returns {boolean} whether target parameter is a correct signal type.
 */
export function isCorrectSignalType<T>(type: T): boolean {
  return isString(type) || isNumber(type) || isSymbol(type);
}
