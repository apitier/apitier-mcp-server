"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ukAddressAutocompleteTool = exports.ukAddressSearchTool = exports.ukPostcodeLookupTool = void 0;
exports.runUkPostcodeLookup = runUkPostcodeLookup;
exports.runUkAddressSearch = runUkAddressSearch;
exports.runUkAddressAutocomplete = runUkAddressAutocomplete;
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
exports.ukAddressSearchTool = {
    name: "search_uk_address",
    description: "Search UK addresses by free-text street address or partial address string. " +
        "Returns matching addresses with full postcode details. Use for address autocomplete or fuzzy address matching.",
    inputSchema: {
        type: "object",
        properties: {
            address: {
                type: "string",
                description: "Partial or full address string to search (e.g. '10 Downing Street London')",
            },
        },
        required: ["address"],
    },
};
exports.ukAddressAutocompleteTool = {
    name: "autocomplete_uk_address",
    description: "Get UK address suggestions as the user types. Returns a ranked list of address completions. " +
        "Ideal for real-time address input fields in forms.",
    inputSchema: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "Partial address string to autocomplete (e.g. '10 Down')",
            },
        },
        required: ["query"],
    },
};
async function runUkPostcodeLookup(args, config) {
    const postcode = args.postcode.replace(/\s+/g, "").toUpperCase();
    const data = await (0, client_js_1.apitierGet)(`${config.baseUrls.postcode}/postcodes/${postcode}`, {}, config.keys.postcode);
    return JSON.stringify(data, null, 2);
}
async function runUkAddressSearch(args, config) {
    const data = await (0, client_js_1.apitierGet)(`${config.baseUrls.postcode}/addresses`, { address: args.address }, config.keys.postcode);
    return JSON.stringify(data, null, 2);
}
async function runUkAddressAutocomplete(args, config) {
    const data = await (0, client_js_1.apitierGet)(`${config.baseUrls.postcode}/addresses/autocomplete`, { query: args.query }, config.keys.postcode);
    return JSON.stringify(data, null, 2);
}
//# sourceMappingURL=uk-postcode.js.map