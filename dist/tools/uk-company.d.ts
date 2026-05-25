import { type ApitierConfig } from "../client.js";
export declare const verifyUkCompanyTool: {
    readonly name: "verify_uk_company";
    readonly geography: readonly ["GB"];
    readonly domain: "kyc";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly q: {
                readonly type: "string";
                readonly description: string;
            };
        };
        readonly required: readonly ["q"];
    };
};
export declare const getCompanyPscTool: {
    readonly name: "get_company_psc";
    readonly geography: readonly ["GB"];
    readonly domain: "kyc";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly company_number: {
                readonly type: "string";
                readonly description: string;
            };
        };
        readonly required: readonly ["company_number"];
    };
};
export declare function runVerifyUkCompany(args: {
    q: string;
}, config: ApitierConfig): Promise<string>;
export declare function runGetCompanyPsc(args: {
    company_number: string;
}, config: ApitierConfig): Promise<string>;
//# sourceMappingURL=uk-company.d.ts.map