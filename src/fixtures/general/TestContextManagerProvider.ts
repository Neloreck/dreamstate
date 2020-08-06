import { createProvider } from "@/dreamstate/core/provision/createProvider";
import { TestContextManager } from "@/fixtures/general/TestContextManager";

export const TextContextManagerProvider = createProvider([ TestContextManager ]);
