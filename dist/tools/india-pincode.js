"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indiaPincodeTool = void 0;
exports.runIndiaPincodeLookup = runIndiaPincodeLookup;
const client_js_1 = require("../client.js");
exports.indiaPincodeTool = {
    name: "lookup_india_pincode",
    description: "Look up an Indian PIN code (postal index number) to get the state, district, sub-district, " +
        "and town/village information. Use for Indian e-commerce checkout, address validation, and delivery routing.",
    inputSchema: {
        type: "object",
        properties: {
            pincode: {
                type: "string",
                description: "6-digit Indian PIN code to look up (e.g. 110001 for New Delhi)",
            },
        },
        required: ["pincode"],
    },
};
async function runIndiaPincodeLookup(args, config) {
    const data = await (0, client_js_1.apitierGet)(`${config.baseUrls.pincode}/in/places/pincode`, { pincode: args.pincode }, config.keys.pincode);
    return JSON.stringify(data, null, 2);
}
//# sourceMappingURL=india-pincode.js.map