"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVatTool = void 0;
exports.runValidateVat = runValidateVat;
const client_js_1 = require("../client.js");
exports.validateVatTool = {
    name: "validate_vat",
    description: "Validate a VAT (Value Added Tax) registration number. " +
        "Checks whether the VAT number is registered and returns the registered business name and address. " +
        "Essential for B2B invoicing agents and checkout flows requiring VAT verification.",
    inputSchema: {
        type: "object",
        properties: {
            vatNumber: {
                type: "string",
                description: "VAT number to validate. Include country prefix (e.g. GB123456789, DE123456789)",
            },
        },
        required: ["vatNumber"],
    },
};
async function runValidateVat(args, config) {
    const data = await (0, client_js_1.apitierGet)(`${config.baseUrls.vat}/validate`, { vat_number: args.vatNumber }, // API uses vat_number, not vatNumber
    config.keys.vat);
    return JSON.stringify(data, null, 2);
}
//# sourceMappingURL=validate-vat.js.map