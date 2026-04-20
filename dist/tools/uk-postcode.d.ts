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
export declare const ukAddressSearchTool: {
    readonly name: "search_uk_address";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly address: {
                readonly type: "string";
                readonly description: "Partial or full address string to search (e.g. '10 Downing Street London')";
            };
        };
        readonly required: readonly ["address"];
    };
};
export declare const ukAddressAutocompleteTool: {
    readonly name: "autocomplete_uk_address";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly query: {
                readonly type: "string";
                readonly description: "Partial address string to autocomplete (e.g. '10 Down')";
            };
        };
        readonly required: readonly ["query"];
    };
};
export declare function runUkPostcodeLookup(args: {
    postcode: string;
}, config: ApitierConfig): Promise<string>;
export declare function runUkAddressSearch(args: {
    address: string;
}, config: ApitierConfig): Promise<string>;
export declare function runUkAddressAutocomplete(args: {
    query: string;
}, config: ApitierConfig): Promise<string>;
//# sourceMappingURL=uk-postcode.d.ts.map