import { type ApitierConfig } from "../client.js";
export declare const validateVatTool: {
    readonly name: "validate_vat";
    readonly geography: readonly ["GB", "EU"];
    readonly domain: "compliance";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly vatNumber: {
                readonly type: "string";
                readonly description: "VAT number to validate. Include country prefix (e.g. GB123456789, DE123456789)";
            };
        };
        readonly required: readonly ["vatNumber"];
    };
};
export declare function runValidateVat(args: {
    vatNumber: string;
}, config: ApitierConfig): Promise<string>;
//# sourceMappingURL=validate-vat.d.ts.map