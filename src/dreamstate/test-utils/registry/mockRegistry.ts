import { createRegistry, IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";

/**
 * Creates a mocked internal registry for scope testing.
 * This registry contains managers and listeners for testing purposes.
 *
 * @returns {IRegistry} The internal registry of managers and listeners.
 */
export function mockRegistry(): IRegistry {
  return createRegistry();
}
