import { type ApitierConfig } from "../client.js";
export declare const verifyUkAddressTool: {
    readonly name: "verify_uk_address";
    readonly geography: readonly ["GB"];
    readonly domain: "address";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly postcode: {
                readonly type: "string";
                readonly description: "UK postcode (e.g. SW1A 2AA or SW1A2AA). Spaces are optional.";
            };
            readonly query: {
                readonly type: "string";
                readonly description: string;
            };
        };
        readonly required: readonly ["postcode"];
    };
};
export declare const lookupUprnTool: {
    readonly name: "lookup_uprn";
    readonly geography: readonly ["GB"];
    readonly domain: "address";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly udprn: {
                readonly type: "string";
                readonly description: string;
            };
        };
        readonly required: readonly ["udprn"];
    };
};
export declare function runVerifyUkAddress(args: {
    postcode: string;
    query?: string;
}, config: ApitierConfig): Promise<string>;
export declare function runLookupUprn(args: {
    udprn: string;
}, config: ApitierConfig): Promise<string>;
//# sourceMappingURL=uk-address-uprn.d.ts.map