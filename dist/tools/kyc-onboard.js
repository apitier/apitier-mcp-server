"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycOnboardTool = void 0;
exports.runKycOnboard = runKycOnboard;
const validate_vat_js_1 = require("./validate-vat.js");
const uk_company_js_1 = require("./uk-company.js");
const uk_address_uprn_js_1 = require("./uk-address-uprn.js");
exports.kycOnboardTool = {
    name: "kyc_onboard_uk",
    geography: ["GB"],
    domain: "kyc",
    description: "Run a full UK business onboarding check in one call. " +
        "Validates the VAT number against HMRC/EU VIES, verifies the company on Companies House, " +
        "retrieves Persons with Significant Control (PSC / beneficial owners), " +
        "and confirms the registered address against Royal Mail PAF. " +
        "Returns a structured decision (PASS / REVIEW / FAIL), a risk score (0–100), " +
        "a list of risk flags, and the full data bundle from each check. " +
        "Requires postcode, vat, and leadAgent subscriptions.",
    inputSchema: {
        type: "object",
        properties: {
            company_name: {
                type: "string",
                description: "Registered company name or Companies House number " +
                    "(e.g. 'Vodafone Group Plc' or '01833679'). " +
                    "Used to look up the company and retrieve its registered address postcode.",
            },
            vat_number: {
                type: "string",
                description: "UK VAT number to validate (e.g. GB123456789). " +
                    "Optional — VAT check is skipped if not supplied.",
            },
            postcode: {
                type: "string",
                description: "Registered address postcode for PAF address verification (e.g. EC1A 1BB). " +
                    "If omitted, address check is skipped.",
            },
        },
        required: ["company_name"],
    },
};
async function runKycOnboard(args, config) {
    const flags = [];
    // Company lookup is always first — we need the company number for PSC
    const companyRaw = await (0, uk_company_js_1.runVerifyUkCompany)({ q: args.company_name }, config);
    const company = JSON.parse(companyRaw);
    const companyStatus = company?.result?.company_status ??
        company?.company_status ??
        "";
    if (companyStatus && companyStatus !== "active") {
        flags.push(`COMPANY_${companyStatus.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`);
    }
    if (!companyStatus) {
        flags.push("COMPANY_NOT_FOUND");
    }
    // PSC, VAT, address can run in parallel once we have the company number
    const companyNumber = company?.result?.company_number ??
        company?.company_number;
    const parallelTasks = [];
    // PSC check
    if (companyNumber) {
        parallelTasks.push((0, uk_company_js_1.runGetCompanyPsc)({ company_number: companyNumber }, config)
            .then((raw) => ["psc", JSON.parse(raw)])
            .catch((err) => ["psc_error", { error: String(err) }]));
    }
    // VAT check
    if (args.vat_number && config.keys.vat) {
        parallelTasks.push((0, validate_vat_js_1.runValidateVat)({ vatNumber: args.vat_number }, config)
            .then((raw) => ["vat", JSON.parse(raw)])
            .catch((err) => ["vat_error", { error: String(err) }]));
    }
    // Address check
    if (args.postcode && config.keys.postcode) {
        parallelTasks.push((0, uk_address_uprn_js_1.runVerifyUkAddress)({ postcode: args.postcode }, config)
            .then((raw) => ["address", JSON.parse(raw)])
            .catch((err) => ["address_error", { error: String(err) }]));
    }
    const parallelResults = await Promise.all(parallelTasks);
    const resultMap = new Map(parallelResults);
    // Evaluate PSC
    const pscData = resultMap.get("psc") ?? resultMap.get("psc_error");
    const pscItems = pscData?.result ??
        pscData?.items ?? [];
    const pscStatus = Array.isArray(pscItems) && pscItems.length > 0 ? "found" : "not_found";
    if (!companyNumber || pscStatus === "not_found") {
        flags.push("NO_PSC_FOUND");
    }
    // Evaluate VAT
    let vatResult = null;
    if (resultMap.has("vat") || resultMap.has("vat_error")) {
        const vatData = resultMap.get("vat") ?? resultMap.get("vat_error");
        const vatValid = vatData?.valid ??
            vatData?.result?.valid;
        vatResult = { status: vatValid ? "valid" : "invalid", data: vatData };
        if (!vatValid)
            flags.push("VAT_INVALID");
    }
    // Evaluate address
    let addressResult = null;
    if (resultMap.has("address") || resultMap.has("address_error")) {
        const addressData = resultMap.get("address") ?? resultMap.get("address_error");
        const addressCount = addressData?.result?.addresses?.length ?? 0;
        addressResult = {
            status: addressCount > 0 ? "verified" : "not_found",
            data: addressData,
        };
        if (addressCount === 0)
            flags.push("ADDRESS_NOT_FOUND");
    }
    // Score: start at 100, deduct per flag
    const FLAG_WEIGHTS = {
        COMPANY_NOT_FOUND: 60,
        NO_PSC_FOUND: 20,
        VAT_INVALID: 25,
        ADDRESS_NOT_FOUND: 15,
    };
    const deduction = flags.reduce((sum, f) => sum + (FLAG_WEIGHTS[f] ?? 20), 0);
    const riskScore = Math.max(0, 100 - deduction);
    const decision = riskScore >= 80 ? "PASS" : riskScore >= 50 ? "REVIEW" : "FAIL";
    const result = {
        decision,
        risk_score: riskScore,
        flags,
        checks: {
            company: { status: companyStatus || "not_found", data: company },
            psc: { status: pscStatus, data: pscData },
            vat: vatResult,
            address: addressResult,
        },
    };
    return JSON.stringify(result, null, 2);
}
//# sourceMappingURL=kyc-onboard.js.map