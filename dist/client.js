"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
exports.resolvePortalKeys = resolvePortalKeys;
exports.apitierGet = apitierGet;
exports.apitierPost = apitierPost;
const BASE_URLS = {
    email: "https://email.apitier.com/v1",
    phone: "https://phone.apitier.com/v1",
    vat: "https://vat.apitier.com/v1",
    postcode: "https://postcode.apitier.com/v1",
    pincode: "https://pincode.apitier.com/v1",
    barcode: "https://barcode.apitier.com/v1",
    convertData: "https://data.apitier.com",
    userAgent: "https://useragent.apitier.com/v1",
    leadAgent: "https://lead.apitier.com/v1",
};
function getConfig() {
    const keys = {
        email: process.env.APITIER_EMAIL_KEY,
        phone: process.env.APITIER_PHONE_KEY,
        vat: process.env.APITIER_VAT_KEY,
        postcode: process.env.APITIER_POSTCODE_KEY,
        pincode: process.env.APITIER_PINCODE_KEY,
        barcode: process.env.APITIER_BARCODE_KEY,
        convertData: process.env.APITIER_CONVERT_DATA_KEY,
        userAgent: process.env.APITIER_USERAGENT_KEY,
        leadAgent: process.env.APITIER_LEAD_AGENT_KEY,
    };
    for (const k of Object.keys(keys)) {
        if (!keys[k])
            delete keys[k];
    }
    if (Object.keys(keys).length === 0) {
        throw new Error("No APITier API keys configured.\n" +
            "Set APITIER_MCP_KEY (unified portal key) or individual service keys:\n" +
            "APITIER_POSTCODE_KEY, APITIER_EMAIL_KEY, APITIER_PHONE_KEY, etc.");
    }
    return { keys, baseUrls: BASE_URLS };
}
/**
 * Resolves a unified MCP token to per-service keys by calling the portal API.
 * Called once at server startup — result is held in memory for the process lifetime.
 */
async function resolvePortalKeys(mcpToken) {
    const portalUrl = process.env.APITIER_PORTAL_URL
        ?? "https://f99m9uxp61.execute-api.eu-west-1.amazonaws.com/prod";
    const portalApiKey = process.env.APITIER_PORTAL_API_KEY
        ?? "DL4teabVaSaRXTwFEi1rE5AB9ZRFfCxc1xASF1tg";
    const url = `${portalUrl}/mcp/keys?token=${encodeURIComponent(mcpToken)}`;
    const response = await fetch(url, { method: "GET", headers: { Accept: "application/json", "x-api-key": portalApiKey } });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Portal key resolution failed (${response.status}): ${body}`);
    }
    const { services } = await response.json();
    if (!services || Object.keys(services).length === 0) {
        throw new Error("No subscribed services found for this MCP token.\n" +
            "Subscribe to at least one APITier service at https://apitier.com");
    }
    // Cast: the portal returns keys using the same names as ServiceKeys
    const keys = services;
    return { keys, baseUrls: BASE_URLS };
}
async function apitierGet(url, params, apiKey) {
    const searchParams = new URLSearchParams({ ...params, "x-api-key": apiKey });
    const response = await fetch(`${url}?${searchParams.toString()}`, {
        method: "GET",
        headers: { Accept: "application/json" },
    });
    const data = (await response.json());
    if (!response.ok) {
        throw new Error(`APITier error ${response.status}: ${data.message ?? "Unknown error"}`);
    }
    return data;
}
async function apitierPost(url, body, apiKey, acceptBinary = false, rawBody = false) {
    const isRaw = rawBody && typeof body === "string";
    const response = await fetch(`${url}?x-api-key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": isRaw ? "text/plain" : "application/json",
            Accept: acceptBinary ? "image/png" : "application/json",
        },
        body: isRaw ? body : JSON.stringify(body),
    });
    if (acceptBinary) {
        const buffer = await response.arrayBuffer();
        return Buffer.from(buffer).toString("base64");
    }
    const data = (await response.json());
    if (!response.ok) {
        throw new Error(`APITier error ${response.status}: ${data.message ?? "Unknown error"}`);
    }
    return data;
}
//# sourceMappingURL=client.js.map