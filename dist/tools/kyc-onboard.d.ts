import type { ApitierConfig } from "../client.js";
export declare const kycOnboardTool: {
    readonly name: "kyc_onboard_uk";
    readonly geography: readonly ["GB"];
    readonly domain: "kyc";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly company_name: {
                readonly type: "string";
                readonly description: string;
            };
            readonly vat_number: {
                readonly type: "string";
                readonly description: string;
            };
            readonly postcode: {
                readonly type: "string";
                readonly description: string;
            };
        };
        readonly required: readonly ["company_name"];
    };
};
export declare function runKycOnboard(args: {
    company_name: string;
    vat_number?: string;
    postcode?: string;
}, config: ApitierConfig): Promise<string>;
//# sourceMappingURL=kyc-onboard.d.ts.map