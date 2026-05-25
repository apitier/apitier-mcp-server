import { type ApitierConfig } from "../client.js";
export declare const validatePhoneTool: {
    readonly name: "validate_phone";
    readonly geography: readonly ["GLOBAL"];
    readonly domain: "identity";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly phone: {
                readonly type: "string";
                readonly description: "Phone number to validate. Include country code prefix (e.g. +447911123456 or +12025550104)";
            };
        };
        readonly required: readonly ["phone"];
    };
};
export declare function runValidatePhone(args: {
    phone: string;
}, config: ApitierConfig): Promise<string>;
//# sourceMappingURL=validate-phone.d.ts.map