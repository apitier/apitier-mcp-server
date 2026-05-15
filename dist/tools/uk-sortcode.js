"use strict";
// UK sort code + account number validation.
// Implements the Vocalink modulus 10 and modulus 11 algorithm using default
// weights. Sort codes not listed in the EISCD exception table (i.e. the
// majority of UK banks) pass through these default weights correctly.
// No external API or data licence required.
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSortCodeTool = void 0;
exports.runValidateSortCode = runValidateSortCode;
exports.validateSortCodeTool = {
    name: "validate_sort_code",
    description: "Validate a UK bank sort code and, optionally, a bank account number. " +
        "Checks format (6 digits, XX-XX-XX notation supported) and runs the " +
        "standard Vocalink modulus 10/11 check when an account number is supplied. " +
        "Use in KYC, onboarding, and payment workflows to catch invalid bank details " +
        "before submission.",
    inputSchema: {
        type: "object",
        properties: {
            sortCode: {
                type: "string",
                description: "UK sort code to validate. Accepts any of: 601613, 60-16-13, 60 16 13",
            },
            accountNumber: {
                type: "string",
                description: "Optional 8-digit UK bank account number. When supplied, a modulus " +
                    "check is performed against the sort code.",
            },
        },
        required: ["sortCode"],
    },
};
// Vocalink default weights for positions U–H (sort code digits + account digits).
// Applied when the sort code is not overridden in the EISCD exception table.
const MOD11_WEIGHTS = [0, 0, 1, 2, 5, 3, 6, 4, 8, 7, 10, 9, 3, 1];
const MOD10_WEIGHTS = [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1];
function normaliseSortCode(input) {
    return input.replace(/[\s\-]/g, "");
}
function normaliseAccountNumber(input) {
    return input.replace(/\s/g, "").padStart(8, "0");
}
function mod11(digits) {
    const total = digits.reduce((sum, d, i) => sum + d * MOD11_WEIGHTS[i], 0);
    return total % 11 === 0;
}
function mod10(digits) {
    // Double every other digit from the right; sum single digits of products.
    const total = digits.reduce((sum, d, i) => {
        const product = d * MOD10_WEIGHTS[i];
        return sum + (product > 9 ? product - 9 : product);
    }, 0);
    return total % 10 === 0;
}
function runValidateSortCode(args) {
    const normalised = normaliseSortCode(args.sortCode);
    const formatValid = /^\d{6}$/.test(normalised);
    if (!formatValid) {
        const result = {
            sortCode: args.sortCode,
            normalised,
            valid: false,
            formatValid: false,
            error: "Sort code must be exactly 6 digits (e.g. 601613 or 60-16-13).",
        };
        return JSON.stringify(result, null, 2);
    }
    if (!args.accountNumber) {
        const result = {
            sortCode: args.sortCode,
            normalised,
            valid: true,
            formatValid: true,
        };
        return JSON.stringify(result, null, 2);
    }
    const normalisedAccount = normaliseAccountNumber(args.accountNumber);
    const accountFormatValid = /^\d{8}$/.test(normalisedAccount);
    if (!accountFormatValid) {
        const result = {
            sortCode: args.sortCode,
            normalised,
            valid: false,
            formatValid: true,
            accountNumber: args.accountNumber,
            accountFormatValid: false,
            error: "Account number must be 8 digits.",
        };
        return JSON.stringify(result, null, 2);
    }
    // Build the 14-digit array: 6 sort code digits + 8 account digits.
    const digits = [...normalised, ...normalisedAccount].map(Number);
    // Attempt mod 11 first (most common); fall back to mod 10.
    const mod11Passed = mod11(digits);
    const mod10Passed = mod10(digits);
    const modulusPassed = mod11Passed || mod10Passed;
    const method = mod11Passed ? "mod11" : "mod10";
    const result = {
        sortCode: args.sortCode,
        normalised,
        valid: modulusPassed,
        formatValid: true,
        accountNumber: normalisedAccount,
        accountFormatValid: true,
        modulusCheck: {
            performed: true,
            method,
            passed: modulusPassed,
            note: "Uses Vocalink default weights. Sort codes in the EISCD exception table " +
                "may require different weights for a definitive result.",
        },
    };
    return JSON.stringify(result, null, 2);
}
//# sourceMappingURL=uk-sortcode.js.map