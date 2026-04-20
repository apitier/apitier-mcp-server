import { apitierGet, type ApitierConfig } from "../client.js";

export const ukPostcodeLookupTool = {
  name: "lookup_uk_postcode",
  description:
    "Look up a UK postcode to get the full address list, district, ward, county, country, and GPS coordinates. " +
    "Use for address auto-fill, delivery routing, or validating user-entered UK addresses.",
  inputSchema: {
    type: "object",
    properties: {
      postcode: {
        type: "string",
        description:
          "UK postcode to look up. Spaces are optional (e.g. SW1A 1AA or SW1A1AA)",
      },
    },
    required: ["postcode"],
  },
} as const;

export const ukAddressSearchTool = {
  name: "search_uk_address",
  description:
    "Search UK addresses by free-text street address or partial address string. " +
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
} as const;

export const ukAddressAutocompleteTool = {
  name: "autocomplete_uk_address",
  description:
    "Get UK address suggestions as the user types. Returns a ranked list of address completions. " +
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
} as const;

export async function runUkPostcodeLookup(
  args: { postcode: string },
  config: ApitierConfig
): Promise<string> {
  const postcode = args.postcode.replace(/\s+/g, "").toUpperCase();
  const data = await apitierGet(
    `${config.baseUrls.postcode}/postcodes/${postcode}`,
    {},
    config.keys.postcode!
  );
  return JSON.stringify(data, null, 2);
}

export async function runUkAddressSearch(
  args: { address: string },
  config: ApitierConfig
): Promise<string> {
  const data = await apitierGet(
    `${config.baseUrls.postcode}/addresses`,
    { address: args.address },
    config.keys.postcode!
  );
  return JSON.stringify(data, null, 2);
}

export async function runUkAddressAutocomplete(
  args: { query: string },
  config: ApitierConfig
): Promise<string> {
  const data = await apitierGet(
    `${config.baseUrls.postcode}/addresses/autocomplete`,
    { query: args.query },
    config.keys.postcode!
  );
  return JSON.stringify(data, null, 2);
}
