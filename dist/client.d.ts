export interface ApiResponse {
    status: number;
    message: string;
    [key: string]: unknown;
}
export interface ServiceKeys {
    email?: string;
    phone?: string;
    vat?: string;
    postcode?: string;
    pincode?: string;
    barcode?: string;
    convertData?: string;
    userAgent?: string;
    leadAgent?: string;
}
export interface ServiceUrls {
    email: string;
    phone: string;
    vat: string;
    postcode: string;
    pincode: string;
    barcode: string;
    convertData: string;
    userAgent: string;
    leadAgent: string;
}
export interface ApitierConfig {
    keys: ServiceKeys;
    baseUrls: ServiceUrls;
}
export declare function getConfig(): ApitierConfig;
/**
 * Resolves a unified MCP token to per-service keys by calling the portal API.
 * Called once at server startup — result is held in memory for the process lifetime.
 */
export declare function resolvePortalKeys(mcpToken: string): Promise<ApitierConfig>;
export declare function apitierGet(url: string, params: Record<string, string>, apiKey: string): Promise<ApiResponse>;
export declare function apitierPost(url: string, body: unknown, apiKey: string, acceptBinary?: boolean, rawBody?: boolean): Promise<ApiResponse | string>;
//# sourceMappingURL=client.d.ts.map