"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildActiveTools = buildActiveTools;
exports.buildRunners = buildRunners;
const index_js_1 = require("./index.js");
// Maps each service subscription key to the tools it enables.
// To add a new tool: add a new entry here — no changes to src/index.ts or lambda/mcp.js required.
const SERVICE_REGISTRY = {
    email: [
        {
            tool: index_js_1.validateEmailTool,
            runner: (args, cfg) => (0, index_js_1.runValidateEmail)(args, cfg),
        },
    ],
    phone: [
        {
            tool: index_js_1.validatePhoneTool,
            runner: (args, cfg) => (0, index_js_1.runValidatePhone)(args, cfg),
        },
    ],
    vat: [
        {
            tool: index_js_1.validateVatTool,
            runner: (args, cfg) => (0, index_js_1.runValidateVat)(args, cfg),
        },
    ],
    postcode: [
        {
            tool: index_js_1.ukPostcodeLookupTool,
            runner: (args, cfg) => (0, index_js_1.runUkPostcodeLookup)(args, cfg),
        },
        {
            tool: index_js_1.verifyUkAddressTool,
            runner: (args, cfg) => (0, index_js_1.runVerifyUkAddress)(args, cfg),
        },
        {
            tool: index_js_1.lookupUprnTool,
            runner: (args, cfg) => (0, index_js_1.runLookupUprn)(args, cfg),
        },
    ],
    pincode: [
        {
            tool: index_js_1.indiaPincodeTool,
            runner: (args, cfg) => (0, index_js_1.runIndiaPincodeLookup)(args, cfg),
        },
    ],
    barcode: [
        {
            tool: index_js_1.generateBarcodeTool,
            runner: (args, cfg) => (0, index_js_1.runGenerateBarcode)(args, cfg),
        },
        {
            tool: index_js_1.generateQrCodeTool,
            runner: (args, cfg) => (0, index_js_1.runGenerateQrCode)(args, cfg),
        },
    ],
    convertData: [
        {
            tool: index_js_1.convertDataTool,
            runner: (args, cfg) => (0, index_js_1.runConvertData)(args, cfg),
        },
    ],
    leadAgent: [
        {
            tool: index_js_1.verifyUkCompanyTool,
            runner: (args, cfg) => (0, index_js_1.runVerifyUkCompany)(args, cfg),
        },
        {
            tool: index_js_1.getCompanyPscTool,
            runner: (args, cfg) => (0, index_js_1.runGetCompanyPsc)(args, cfg),
        },
    ],
};
// Sort code is always available — no subscription key required.
const ALWAYS_ON = [
    {
        tool: index_js_1.validateSortCodeTool,
        runner: (args) => (0, index_js_1.runValidateSortCode)(args),
    },
];
// KYC onboarding composite tool — requires all three data services.
const KYC_COMPOSITE = {
    tool: index_js_1.kycOnboardTool,
    runner: (args, cfg) => (0, index_js_1.runKycOnboard)(args, cfg),
};
function collectEntries(config) {
    const entries = [...ALWAYS_ON];
    for (const key of Object.keys(config.keys)) {
        entries.push(...(SERVICE_REGISTRY[key] ?? []));
    }
    // Composite tool appears only when all three required services are subscribed.
    if (config.keys.vat && config.keys.leadAgent && config.keys.postcode) {
        entries.push(KYC_COMPOSITE);
    }
    return entries;
}
function buildActiveTools(config) {
    return collectEntries(config).map((e) => e.tool);
}
function buildRunners(config) {
    const map = new Map();
    for (const { tool, runner } of collectEntries(config)) {
        map.set(tool.name, runner);
    }
    return map;
}
//# sourceMappingURL=registry.js.map