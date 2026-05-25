import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { ApitierConfig } from "../client.js";
type ToolRunner = (args: Record<string, unknown>, config: ApitierConfig) => Promise<string> | string;
export declare function buildActiveTools(config: ApitierConfig): Tool[];
export declare function buildRunners(config: ApitierConfig): Map<string, ToolRunner>;
export {};
//# sourceMappingURL=registry.d.ts.map