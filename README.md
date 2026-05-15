# @apitier/mcp-server

MCP (Model Context Protocol) server that exposes all APITier utility APIs as tools for AI agents.

## Tools Available

### UK Address & Property

| Tool | Description |
| --- | --- |
| `verify_uk_address` | Verify a UK address against Royal Mail PAF — returns canonical address, UPRN, UDPRN, and per-delivery-point geocode. Accepts optional query fragment to filter to a specific premise. |
| `lookup_uprn` | Look up a full AddressBase record by UDPRN — returns UPRN, PAF canonical address, lat/lng/easting/northing, and Welsh address where applicable. Use UDPRN from `verify_uk_address`. |
| `lookup_uk_postcode` | UK postcode → full PAF address list + district, ward, county, country, and geocode |

### UK Business & Compliance

| Tool | Description |
| --- | --- |
| `verify_uk_company` | Look up a UK company on Companies House by name or company number — returns registered name, address, status (active/dissolved/dormant), SIC codes, incorporation date, and filing health flags. |
| `get_company_psc` | Retrieve the Persons with Significant Control (PSC) register for a UK company — returns each PSC's name, nature of control, notified date, and ceased status. Required for UK AML beneficial ownership checks. |
| `validate_vat` | Validate EU/UK VAT numbers, returns registered business name and address |
| `validate_sort_code` | Validate a UK bank sort code and optionally a bank account number using the Vocalink modulus 10/11 algorithm. Self-contained — no API key required. |

### Global Utilities

| Tool | Description |
| --- | --- |
| `validate_email` | Validate email — syntax, MX, SMTP, disposable check |
| `validate_phone` | Validate & parse phone numbers (international) |
| `lookup_india_pincode` | Indian PIN code → state/district/town |
| `generate_barcode` | Generate barcode image (Code128, EAN-13, UPC, etc.) |
| `generate_qrcode` | Generate QR code image with optional logo + colour |
| `convert_data` | Convert between CSV, JSON, XML, YAML |

## Setup

### 1. Get your API keys

Sign up at [apitier.com](https://apitier.com). Each APITier service has its own subscription and API key. You only need keys for the services you want to use — tools without a configured key are automatically omitted from the MCP tool list.

### 2. Install

```bash
npm install -g @apitier/mcp-server
# or run directly without installing:
npx @apitier/mcp-server
```

---

## Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "apitier": {
      "command": "npx",
      "args": ["@apitier/mcp-server"],
      "env": {
        "APITIER_POSTCODE_KEY":     "key-from-postcode-subscription",
        "APITIER_LEAD_AGENT_KEY":      "key-from-lead-agent-subscription",
        "APITIER_EMAIL_KEY":        "key-from-email-subscription",
        "APITIER_PHONE_KEY":        "key-from-phone-subscription",
        "APITIER_VAT_KEY":          "key-from-vat-subscription",
        "APITIER_BARCODE_KEY":      "key-from-barcode-subscription",
        "APITIER_CONVERT_DATA_KEY": "key-from-data-conversion-subscription"
      }
    }
  }
}
```

Only set keys for services you have subscribed to. Restart Claude Desktop — you will see only the tools for your active subscriptions.

---

## Cursor / Windsurf / other MCP clients

```json
{
  "mcp": {
    "servers": {
      "apitier": {
        "command": "npx",
        "args": ["@apitier/mcp-server"],
        "env": {
          "APITIER_API_KEY": "your-api-key-here"
        }
      }
    }
  }
}
```

---

## LangChain (Python)

```python
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from langchain_mcp_adapters.tools import load_mcp_tools
from langgraph.prebuilt import create_react_agent
from langchain_anthropic import ChatAnthropic

async def main():
    server_params = StdioServerParameters(
        command="npx",
        args=["@apitier/mcp-server"],
        env={"APITIER_API_KEY": "your-api-key"},
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await load_mcp_tools(session)

            model = ChatAnthropic(model="claude-sonnet-4-6")
            agent = create_react_agent(model, tools)

            result = await agent.ainvoke({
                "messages": "Validate this email: test@example.com and look up postcode SW1A 1AA"
            })
            print(result["messages"][-1].content)
```

---

## Vercel AI SDK (TypeScript)

```typescript
import { experimental_createMCPClient as createMCPClient } from "ai";
import { Experimental_StdioMCPTransport as StdioMCPTransport } from "ai/mcp-stdio";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

const mcp = await createMCPClient({
  transport: new StdioMCPTransport({
    command: "npx",
    args: ["@apitier/mcp-server"],
    env: { APITIER_API_KEY: process.env.APITIER_API_KEY! },
  }),
});

const tools = await mcp.tools();

const { text } = await generateText({
  model: anthropic("claude-sonnet-4-6"),
  tools,
  prompt: "Validate the email user@example.com and generate a QR code for https://apitier.com",
});

await mcp.close();
```

---

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `APITIER_POSTCODE_KEY` | One or more required | UK Postcode subscription — enables `verify_uk_address`, `lookup_uprn`, `lookup_uk_postcode` |
| `APITIER_LEAD_AGENT_KEY` | One or more required | Lead Agent subscription — enables `verify_uk_company`, `get_company_psc` |
| `APITIER_EMAIL_KEY` | One or more required | Email Validation subscription — enables `validate_email` |
| `APITIER_PHONE_KEY` | One or more required | Phone Validation subscription — enables `validate_phone` |
| `APITIER_VAT_KEY` | One or more required | VAT Validation subscription — enables `validate_vat` |
| `APITIER_PINCODE_KEY` | One or more required | India Pincode subscription — enables `lookup_india_pincode` |
| `APITIER_BARCODE_KEY` | One or more required | Barcode/QR Code subscription — enables `generate_barcode`, `generate_qrcode` |
| `APITIER_CONVERT_DATA_KEY` | One or more required | Data Conversion subscription — enables `convert_data` |

`validate_sort_code` requires no API key — it is always available.

---

## Development

```bash
git clone https://github.com/apitier/apitier-mcp-server.git
cd apitier-mcp-server
npm install
npm run build
APITIER_API_KEY=your-key node dist/index.js
```

To test with the MCP inspector:

```bash
npx @modelcontextprotocol/inspector npx @apitier/mcp-server
```

Set `APITIER_API_KEY` in the inspector's environment variables panel.

---

## Example Agent Prompts

Once connected to Claude Desktop, you can say:


### UK address & property

- *"Verify this address and give me its UPRN: 10 Downing Street, SW1A 2AA"*
- *"Look up UK postcode EC1A 1BB and fill in the address form"*
- *"I have a UDPRN — look it up and return the full address record including UPRN"*

### UK business & compliance (KYC)

- *"Verify this UK company on Companies House: Barclays Bank UK PLC"*
- *"Who are the persons with significant control for company number 00026167?"*
- *"Validate this UK sort code and account number: 60-16-13 / 31926819"*
- *"Verify this VAT number before I send the invoice: GB123456789"*

### Global utilities

- *"Validate this list of emails and tell me which ones are invalid: ..."*
- *"Generate a QR code for our company website with our logo"*
- *"I have a CSV file — convert it to JSON"*
- *"Validate these phone numbers and tell me which country each is from: ..."*
