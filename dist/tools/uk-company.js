"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyPscTool = exports.verifyUkCompanyTool = void 0;
exports.runVerifyUkCompany = runVerifyUkCompany;
exports.runGetCompanyPsc = runGetCompanyPsc;
const client_js_1 = require("../client.js");
// ── verify_uk_company ─────────────────────────────────────────────────────────
exports.verifyUkCompanyTool = {
    name: "verify_uk_company",
    description: "Look up a UK company on Companies House by name or company number. " +
        "Returns the registered name, address, incorporation date, SIC codes, " +
        "company status (active/dissolved/dormant/liquidation), and filing health flags. " +
        "Use in KYC, onboarding, and statement audit workflows to verify UK business identity.",
    inputSchema: {
        type: "object",
        properties: {
            q: {
                type: "string",
                description: "Company name or Companies House number. " +
                    "Numbers are matched directly (e.g. 01234567, SC123456). " +
                    "Names trigger a Companies House search — prefer exact registered names for best results.",
            },
        },
        required: ["q"],
    },
};
// ── get_company_psc ───────────────────────────────────────────────────────────
exports.getCompanyPscTool = {
    name: "get_company_psc",
    description: "Retrieve the Persons with Significant Control (PSC) register for a UK company. " +
        "Returns each PSC's name, nature of control (e.g. 75–100% share ownership), " +
        "notified date, nationality, and whether they have ceased. " +
        "Required for UK AML beneficial ownership checks.",
    inputSchema: {
        type: "object",
        properties: {
            company_number: {
                type: "string",
                description: "Companies House company number (e.g. 01234567 or SC123456). " +
                    "Use verify_uk_company first if you only have a company name.",
            },
        },
        required: ["company_number"],
    },
};
// ── runners ───────────────────────────────────────────────────────────────────
async function runVerifyUkCompany(args, config) {
    const data = await (0, client_js_1.apitierGet)(`${config.baseUrls.leadAgent}/company`, { q: args.q }, config.keys.leadAgent);
    return JSON.stringify(data, null, 2);
}
async function runGetCompanyPsc(args, config) {
    const data = await (0, client_js_1.apitierGet)(`${config.baseUrls.leadAgent}/company/psc`, { company_number: args.company_number }, config.keys.leadAgent);
    return JSON.stringify(data, null, 2);
}
//# sourceMappingURL=uk-company.js.map