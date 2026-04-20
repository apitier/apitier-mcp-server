import { type ApitierConfig } from "../client.js";
declare const BARCODE_FORMATS: readonly ["code128", "code128a", "code128b", "code128c", "ean13", "ean8", "ean5", "ean2", "upc", "code39", "itf14", "msi", "msi10", "msi11", "pharmacode", "codabar"];
type BarcodeFormat = typeof BARCODE_FORMATS[number];
export declare const generateBarcodeTool: {
    readonly name: "generate_barcode";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly text: {
                readonly type: "string";
                readonly description: "The data to encode in the barcode (e.g. '123456789012' for EAN-13)";
            };
            readonly format: {
                readonly type: "string";
                readonly enum: readonly ["code128", "code128a", "code128b", "code128c", "ean13", "ean8", "ean5", "ean2", "upc", "code39", "itf14", "msi", "msi10", "msi11", "pharmacode", "codabar"];
                readonly description: "Barcode format. Defaults to 'code128' if not specified.";
            };
            readonly width: {
                readonly type: "number";
                readonly description: "Bar width in pixels (default: 2)";
            };
            readonly height: {
                readonly type: "number";
                readonly description: "Barcode height in pixels (default: 100)";
            };
            readonly displayValue: {
                readonly type: "boolean";
                readonly description: "Whether to display the encoded text below the barcode (default: true)";
            };
            readonly background: {
                readonly type: "string";
                readonly description: "Background colour as hex (default: '#ffffff')";
            };
            readonly lineColor: {
                readonly type: "string";
                readonly description: "Bar colour as hex (default: '#000000')";
            };
        };
        readonly required: readonly ["text"];
    };
};
export declare const generateQrCodeTool: {
    readonly name: "generate_qrcode";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly text: {
                readonly type: "string";
                readonly description: "The content to encode — URL, plain text, vCard, WiFi config, etc.";
            };
            readonly width: {
                readonly type: "number";
                readonly description: "Image width in pixels (default: 256)";
            };
            readonly height: {
                readonly type: "number";
                readonly description: "Image height in pixels (default: 256)";
            };
            readonly colorDark: {
                readonly type: "string";
                readonly description: "Dark module colour as hex (default: '#000000')";
            };
            readonly colorLight: {
                readonly type: "string";
                readonly description: "Light module colour as hex (default: '#ffffff')";
            };
            readonly logo: {
                readonly type: "string";
                readonly description: "URL of a logo image to embed in the centre of the QR code";
            };
            readonly title: {
                readonly type: "string";
                readonly description: "Optional title text to display below the QR code";
            };
            readonly correctLevel: {
                readonly type: "number";
                readonly enum: readonly [1, 0, 3, 2];
                readonly description: "Error correction level: 1=L(7%), 0=M(15%), 3=Q(25%), 2=H(30%). Use 3 or 2 when embedding a logo.";
            };
        };
        readonly required: readonly ["text"];
    };
};
export declare function runGenerateBarcode(args: {
    text: string;
    format?: BarcodeFormat;
    width?: number;
    height?: number;
    displayValue?: boolean;
    background?: string;
    lineColor?: string;
}, config: ApitierConfig): Promise<string>;
export declare function runGenerateQrCode(args: {
    text: string;
    width?: number;
    height?: number;
    colorDark?: string;
    colorLight?: string;
    logo?: string;
    title?: string;
    correctLevel?: number;
}, config: ApitierConfig): Promise<string>;
export {};
//# sourceMappingURL=barcode.d.ts.map