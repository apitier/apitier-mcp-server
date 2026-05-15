"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupUprnTool = exports.verifyUkAddressTool = void 0;
exports.runVerifyUkAddress = runVerifyUkAddress;
exports.runLookupUprn = runLookupUprn;
const client_js_1 = require("../client.js");
// ── verify_uk_address ─────────────────────────────────────────────────────────
exports.verifyUkAddressTool = {
    name: "verify_uk_address",
    description: "Verify a UK address against the Royal Mail PAF (Postal Address File). " +
        "Returns the canonical PAF address, UPRN (Unique Property Reference Number), " +
        "UDPRN, per-delivery-point geocode, and postcode-level admin data " +
        "(district, ward, county, country). " +
        "Use in KYC and onboarding workflows to confirm a UK address is real and " +
        "to obtain the UPRN as a persistent cross-source identity anchor. " +
        "Supply query to filter results to a specific premise when multiple " +
        "addresses exist at the postcode.",
    inputSchema: {
        type: "object",
        properties: {
            postcode: {
                type: "string",
                description: "UK postcode (e.g. SW1A 2AA or SW1A2AA). Spaces are optional.",
            },
            query: {
                type: "string",
                description: "Optional address fragment to filter results — " +
                    "building number, building name, or organisation name " +
                    "(e.g. '10', 'Flat 3', 'Barclays'). " +
                    "Omit to return all addresses at the postcode.",
            },
        },
        required: ["postcode"],
    },
};
// ── lookup_uprn ───────────────────────────────────────────────────────────────
exports.lookupUprnTool = {
    name: "lookup_uprn",
    description: "Look up a UK address by UDPRN (Unique Delivery Point Reference Number) " +
        "and return the full AddressBase record including UPRN, PAF canonical " +
        "address, per-delivery-point geocode (latitude/longitude/easting/northing), " +
        "match type, and Welsh address where applicable. " +
        "UDPRN is returned by verify_uk_address. Use this tool to enrich an " +
        "address with its persistent UPRN identifier and precise geocode " +
        "for cross-source entity resolution.",
    inputSchema: {
        type: "object",
        properties: {
            udprn: {
                type: "string",
                description: "UDPRN to look up. Obtain from verify_uk_address (each address " +
                    "in the result includes a udprn field).",
            },
        },
        required: ["udprn"],
    },
};
// ── helpers ───────────────────────────────────────────────────────────────────
function matchesQuery(address, query) {
    const q = query.toLowerCase();
    const fields = [
        address.building_number,
        address.building_name,
        address.sub_building_name,
        address.organisation_name,
        address.line_1,
        address.premise,
    ];
    return fields.some((f) => typeof f === "string" && f.toLowerCase().includes(q));
}
// ── runners ───────────────────────────────────────────────────────────────────
async function runVerifyUkAddress(args, config) {
    const postcode = args.postcode.replace(/\s+/g, "").toUpperCase();
    const data = await (0, client_js_1.apitierGet)(`${config.baseUrls.postcode}/postcodes/${postcode}`, {}, config.keys.postcode);
    if (!args.query || !data.result?.addresses) {
        return JSON.stringify(data, null, 2);
    }
    // Filter to matching addresses, preserve all postcode-level fields.
    const matched = data.result.addresses.filter((a) => matchesQuery(a, args.query));
    return JSON.stringify({ ...data, result: { ...data.result, addresses: matched, matched_count: matched.length } }, null, 2);
}
async function runLookupUprn(args, config) {
    const data = await (0, client_js_1.apitierGet)(`${config.baseUrls.postcode}/udprn/${args.udprn}`, {}, config.keys.postcode);
    return JSON.stringify(data, null, 2);
}
//# sourceMappingURL=uk-address-uprn.js.map