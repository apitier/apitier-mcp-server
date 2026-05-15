#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { getConfig, resolvePortalKeys, type ApitierConfig } from "./client.js";
import {
  validateEmailTool,       runValidateEmail,
  validatePhoneTool,       runValidatePhone,
  validateVatTool,         runValidateVat,
  ukPostcodeLookupTool,    runUkPostcodeLookup,
  indiaPincodeTool,        runIndiaPincodeLookup,
  generateBarcodeTool,     runGenerateBarcode,
  generateQrCodeTool,      runGenerateQrCode,
  convertDataTool,         runConvertData,
  validateSortCodeTool,    runValidateSortCode,
  verifyUkCompanyTool,     runVerifyUkCompany,
  getCompanyPscTool,       runGetCompanyPsc,
  verifyUkAddressTool,     runVerifyUkAddress,
  lookupUprnTool,          runLookupUprn,
} from "./tools/index.js";

// Tools are gated by whether the user has a key for that service.
// With a portal key the set is resolved dynamically at startup.
function buildActiveTools(config: ApitierConfig): Tool[] {
  const k = config.keys;
  // Sort code validation is self-contained — always available, no key required.
  const tools: Tool[] = [validateSortCodeTool as unknown as Tool];
  if (k.email)       tools.push(validateEmailTool as unknown as Tool);
  if (k.phone)       tools.push(validatePhoneTool as unknown as Tool);
  if (k.vat)         tools.push(validateVatTool as unknown as Tool);
  if (k.postcode)    tools.push(
                       ukPostcodeLookupTool as unknown as Tool,
                       verifyUkAddressTool  as unknown as Tool,
                       lookupUprnTool       as unknown as Tool
                     );
  if (k.pincode)     tools.push(indiaPincodeTool as unknown as Tool);
  if (k.barcode)     tools.push(
                       generateBarcodeTool as unknown as Tool,
                       generateQrCodeTool as unknown as Tool
                     );
  if (k.convertData) tools.push(convertDataTool as unknown as Tool);
  if (k.leadAgent)     tools.push(
                       verifyUkCompanyTool as unknown as Tool,
                       getCompanyPscTool   as unknown as Tool
                     );
  return tools;
}

async function main() {
  // Two auth modes:
  //   1. APITIER_MCP_KEY — single portal token, resolves service keys via portal API
  //   2. Individual APITIER_*_KEY env vars — direct service keys (legacy / dev)
  const mcpToken = process.env.APITIER_MCP_KEY;
  const config = mcpToken ? await resolvePortalKeys(mcpToken) : getConfig();

  const activeTools = buildActiveTools(config);

  const server = new Server(
    { name: "apitier-mcp-server", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: activeTools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;

    try {
      let result: string;

      switch (name) {
        case "validate_email":
          result = await runValidateEmail(args as { email: string }, config);
          break;
        case "validate_phone":
          result = await runValidatePhone(args as { phone: string }, config);
          break;
        case "validate_vat":
          result = await runValidateVat(args as { vatNumber: string }, config);
          break;
        case "lookup_uk_postcode":
          result = await runUkPostcodeLookup(args as { postcode: string }, config);
          break;
        case "lookup_india_pincode":
          result = await runIndiaPincodeLookup(args as { pincode: string }, config);
          break;
        case "generate_barcode":
          result = await runGenerateBarcode(args as Parameters<typeof runGenerateBarcode>[0], config);
          break;
        case "generate_qrcode":
          result = await runGenerateQrCode(args as Parameters<typeof runGenerateQrCode>[0], config);
          break;
        case "convert_data":
          result = await runConvertData(args as Parameters<typeof runConvertData>[0], config);
          break;
        case "validate_sort_code":
          result = runValidateSortCode(args as { sortCode: string; accountNumber?: string });
          break;
        case "verify_uk_company":
          result = await runVerifyUkCompany(args as { q: string }, config);
          break;
        case "get_company_psc":
          result = await runGetCompanyPsc(args as { company_number: string }, config);
          break;
        case "verify_uk_address":
          result = await runVerifyUkAddress(args as { postcode: string; query?: string }, config);
          break;
        case "lookup_uprn":
          result = await runLookupUprn(args as { udprn: string }, config);
          break;
        default:
          return {
            content: [{ type: "text" as const, text: `Unknown tool: ${name}` }],
            isError: true,
          };
      }

      return { content: [{ type: "text" as const, text: result }] };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
