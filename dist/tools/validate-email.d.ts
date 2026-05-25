import { type ApitierConfig } from "../client.js";
export declare const validateEmailTool: {
    readonly name: "validate_email";
    readonly geography: readonly ["GLOBAL"];
    readonly domain: "identity";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly email: {
                readonly type: "string";
                readonly description: "The email address to validate (e.g. user@example.com)";
            };
        };
        readonly required: readonly ["email"];
    };
};
export declare function runValidateEmail(args: {
    email: string;
}, config: ApitierConfig): Promise<string>;
//# sourceMappingURL=validate-email.d.ts.map