"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ukPostcodeLookupTool = void 0;
exports.runUkPostcodeLookup = runUkPostcodeLookup;
const client_js_1 = require("../client.js");
exports.ukPostcodeLookupTool = {
    name: "lookup_uk_postcode",
    description: "Look up a UK postcode to get the full address list, district, ward, county, country, and GPS coordinates. " +
        "Use for address auto-fill, delivery routing, or validating user-entered UK addresses.",
    inputSchema: {
        type: "object",
        properties: {
            postcode: {
                type: "string",
                description: "UK postcode to look up. Spaces are optional (e.g. SW1A 1AA or SW1A1AA)",
            },
        },
        required: ["postcode"],
    },
};
async function runUkPostcodeLookup(args, config) {
    const postcode = args.postcode.replace(/\s+/g, "").toUpperCase();
    const data = await (0, client_js_1.apitierGet)(`${config.baseUrls.postcode}/postcodes/${postcode}`, {}, config.keys.postcode);
    return JSON.stringify(data, null, 2);
}
//# sourceMappingURL=uk-postcode.js.map