#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const client_js_1 = require("./client.js");
const index_js_2 = require("./tools/index.js");
// Tools are gated by whether the user has a key for that service.
// With a portal key the set is resolved dynamically at startup.
function buildActiveTools(config) {
    const k = config.keys;
    const tools = [];
    if (k.email)
        tools.push(index_js_2.validateEmailTool);
    if (k.phone)
        tools.push(index_js_2.validatePhoneTool);
    if (k.vat)
        tools.push(index_js_2.validateVatTool);
    if (k.postcode)
        tools.push(index_js_2.ukPostcodeLookupTool, index_js_2.ukAddressSearchTool, index_js_2.ukAddressAutocompleteTool);
    if (k.pincode)
        tools.push(index_js_2.indiaPincodeTool);
    if (k.barcode)
        tools.push(index_js_2.generateBarcodeTool, index_js_2.generateQrCodeTool);
    if (k.convertData)
        tools.push(index_js_2.convertDataTool);
    return tools;
}
async function main() {
    // Two auth modes:
    //   1. APITIER_MCP_KEY — single portal token, resolves service keys via portal API
    //   2. Individual APITIER_*_KEY env vars — direct service keys (legacy / dev)
    const mcpToken = process.env.APITIER_MCP_KEY;
    const config = mcpToken ? await (0, client_js_1.resolvePortalKeys)(mcpToken) : (0, client_js_1.getConfig)();
    const activeTools = buildActiveTools(config);
    const server = new index_js_1.Server({ name: "apitier-mcp-server", version: "1.0.0" }, { capabilities: { tools: {} } });
    server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => ({
        tools: activeTools,
    }));
    server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
        const { name, arguments: args = {} } = request.params;
        try {
            let result;
            switch (name) {
                case "validate_email":
                    result = await (0, index_js_2.runValidateEmail)(args, config);
                    break;
                case "validate_phone":
                    result = await (0, index_js_2.runValidatePhone)(args, config);
                    break;
                case "validate_vat":
                    result = await (0, index_js_2.runValidateVat)(args, config);
                    break;
                case "lookup_uk_postcode":
                    result = await (0, index_js_2.runUkPostcodeLookup)(args, config);
                    break;
                case "search_uk_address":
                    result = await (0, index_js_2.runUkAddressSearch)(args, config);
                    break;
                case "autocomplete_uk_address":
                    result = await (0, index_js_2.runUkAddressAutocomplete)(args, config);
                    break;
                case "lookup_india_pincode":
                    result = await (0, index_js_2.runIndiaPincodeLookup)(args, config);
                    break;
                case "generate_barcode":
                    result = await (0, index_js_2.runGenerateBarcode)(args, config);
                    break;
                case "generate_qrcode":
                    result = await (0, index_js_2.runGenerateQrCode)(args, config);
                    break;
                case "convert_data":
                    result = await (0, index_js_2.runConvertData)(args, config);
                    break;
                default:
                    return {
                        content: [{ type: "text", text: `Unknown tool: ${name}` }],
                        isError: true,
                    };
            }
            return { content: [{ type: "text", text: result }] };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            return {
                content: [{ type: "text", text: `Error: ${message}` }],
                isError: true,
            };
        }
    });
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    process.stderr.write(`Fatal: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
});
//# sourceMappingURL=index.js.map