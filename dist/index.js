#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const client_js_1 = require("./client.js");
const registry_js_1 = require("./tools/registry.js");
async function main() {
    // Two auth modes:
    //   1. APITIER_MCP_KEY — single portal token, resolves service keys via portal API
    //   2. Individual APITIER_*_KEY env vars — direct service keys (legacy / dev)
    const mcpToken = process.env.APITIER_MCP_KEY;
    const config = mcpToken ? await (0, client_js_1.resolvePortalKeys)(mcpToken) : (0, client_js_1.getConfig)();
    const activeTools = (0, registry_js_1.buildActiveTools)(config);
    const runners = (0, registry_js_1.buildRunners)(config);
    const server = new index_js_1.Server({ name: "apitier-mcp-server", version: "1.2.0" }, { capabilities: { tools: {} } });
    server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => ({
        tools: activeTools,
    }));
    server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
        const { name, arguments: args = {} } = request.params;
        const runner = runners.get(name);
        if (!runner) {
            return {
                content: [{ type: "text", text: `Unknown tool: ${name}` }],
                isError: true,
            };
        }
        try {
            const result = await runner(args, config);
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