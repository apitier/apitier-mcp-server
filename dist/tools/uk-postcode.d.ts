import { type ApitierConfig } from "../client.js";
export declare const ukPostcodeLookupTool: {
    readonly name: "lookup_uk_postcode";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly postcode: {
                readonly type: "string";
                readonly description: "UK postcode to look up. Spaces are optional (e.g. SW1A 1AA or SW1A1AA)";
            };
        };
        readonly required: readonly ["postcode"];
    };
};
export declare function runUkPostcodeLookup(args: {
    postcode: string;
}, config: ApitierConfig): Promise<string>;
//# sourceMappingURL=uk-postcode.d.ts.map