"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmailTool = void 0;
exports.runValidateEmail = runValidateEmail;
const client_js_1 = require("../client.js");
exports.validateEmailTool = {
    name: "validate_email",
    geography: ["GLOBAL"],
    domain: "identity",
    description: "Validate an email address. Checks syntax, MX records, SMTP reachability, typos, and disposable domains. " +
        "Use before storing any user-provided email address. Returns isValid flag plus per-check breakdown.",
    inputSchema: {
        type: "object",
        properties: {
            email: {
                type: "string",
                description: "The email address to validate (e.g. user@example.com)",
            },
        },
        required: ["email"],
    },
};
async function runValidateEmail(args, config) {
    const data = await (0, client_js_1.apitierGet)(`${config.baseUrls.email}/validate`, { email: args.email }, config.keys.email);
    return JSON.stringify(data, null, 2);
}
//# sourceMappingURL=validate-email.js.map