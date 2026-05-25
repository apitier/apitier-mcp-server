"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDataTool = void 0;
exports.runConvertData = runConvertData;
const client_js_1 = require("../client.js");
const DATA_FORMATS = ["csv", "json", "xml", "yaml"];
exports.convertDataTool = {
    name: "convert_data",
    geography: ["GLOBAL"],
    domain: "utilities",
    description: "Convert data between formats: CSV, JSON, XML, and YAML. " +
        "Pass the source data as a string and specify input and output formats. " +
        "Use in ETL pipelines, data processing agents, API integration workflows, and document automation.",
    inputSchema: {
        type: "object",
        properties: {
            data: {
                type: "string",
                description: "The source data string to convert",
            },
            from: {
                type: "string",
                enum: DATA_FORMATS,
                description: "Source data format",
            },
            to: {
                type: "string",
                enum: DATA_FORMATS,
                description: "Target data format",
            },
        },
        required: ["data", "from", "to"],
    },
};
async function runConvertData(args, config) {
    if (args.from === args.to) {
        return args.data;
    }
    const result = await (0, client_js_1.apitierPost)(`${config.baseUrls.convertData}/convert/${args.from}/to/${args.to}`, args.data, config.keys.convertData, false, true // send raw string body, not JSON-encoded
    );
    if (typeof result === "string")
        return result;
    return JSON.stringify(result, null, 2);
}
//# sourceMappingURL=convert-data.js.map