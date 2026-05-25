"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePhoneTool = void 0;
exports.runValidatePhone = runValidatePhone;
const client_js_1 = require("../client.js");
exports.validatePhoneTool = {
    name: "validate_phone",
    geography: ["GLOBAL"],
    domain: "identity",
    description: "Validate and parse a phone number. Returns whether it is valid, the country, carrier, " +
        "line type (mobile/landline), and international format. Accepts numbers in any international format.",
    inputSchema: {
        type: "object",
        properties: {
            phone: {
                type: "string",
                description: "Phone number to validate. Include country code prefix (e.g. +447911123456 or +12025550104)",
            },
        },
        required: ["phone"],
    },
};
async function runValidatePhone(args, config) {
    const data = await (0, client_js_1.apitierGet)(`${config.baseUrls.phone}/validate`, { phone: args.phone }, config.keys.phone);
    return JSON.stringify(data, null, 2);
}
//# sourceMappingURL=validate-phone.js.map