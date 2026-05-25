import { type ApitierConfig } from "../client.js";
declare const DATA_FORMATS: readonly ["csv", "json", "xml", "yaml"];
type DataFormat = typeof DATA_FORMATS[number];
export declare const convertDataTool: {
    readonly name: "convert_data";
    readonly geography: readonly ["GLOBAL"];
    readonly domain: "utilities";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly data: {
                readonly type: "string";
                readonly description: "The source data string to convert";
            };
            readonly from: {
                readonly type: "string";
                readonly enum: readonly ["csv", "json", "xml", "yaml"];
                readonly description: "Source data format";
            };
            readonly to: {
                readonly type: "string";
                readonly enum: readonly ["csv", "json", "xml", "yaml"];
                readonly description: "Target data format";
            };
        };
        readonly required: readonly ["data", "from", "to"];
    };
};
export declare function runConvertData(args: {
    data: string;
    from: DataFormat;
    to: DataFormat;
}, config: ApitierConfig): Promise<string>;
export {};
//# sourceMappingURL=convert-data.d.ts.map