import { AuthContextManager } from "./AuthContextManager";
import { DataContextManager } from "./DataContextManager";

export * from "./AuthContextManager";
export * from "./DataContextManager";

export const authContextManager: AuthContextManager = new AuthContextManager();
export const dataContextManager: DataContextManager = new DataContextManager();
