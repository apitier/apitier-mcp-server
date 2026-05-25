import { type ApitierConfig } from "../client.js";
export declare const indiaPincodeTool: {
    readonly name: "lookup_india_pincode";
    readonly geography: readonly ["IN"];
    readonly domain: "address";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly pincode: {
                readonly type: "string";
                readonly description: "6-digit Indian PIN code to look up (e.g. 110001 for New Delhi)";
            };
        };
        readonly required: readonly ["pincode"];
    };
};
export declare function runIndiaPincodeLookup(args: {
    pincode: string;
}, config: ApitierConfig): Promise<string>;
//# sourceMappingURL=india-pincode.d.ts.map