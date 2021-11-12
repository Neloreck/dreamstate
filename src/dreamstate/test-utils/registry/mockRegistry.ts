import { createRegistry, IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";

/**
 * Mock internal registry for scope testing.
 * @returns {IRegistry} internal registry of managers and listeners.
 */
export function mockRegistry(): IRegistry {
  return createRegistry();
}
