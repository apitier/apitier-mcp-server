export declare const validateSortCodeTool: {
    readonly name: "validate_sort_code";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly sortCode: {
                readonly type: "string";
                readonly description: "UK sort code to validate. Accepts any of: 601613, 60-16-13, 60 16 13";
            };
            readonly accountNumber: {
                readonly type: "string";
                readonly description: string;
            };
        };
        readonly required: readonly ["sortCode"];
    };
};
export declare function runValidateSortCode(args: {
    sortCode: string;
    accountNumber?: string;
}): string;
//# sourceMappingURL=uk-sortcode.d.ts.map