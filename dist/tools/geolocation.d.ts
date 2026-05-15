interface GeoConfig {
    geoKey: string;
}
export declare const geocodeAddressTool: {
    readonly name: "geocode_address";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly address: {
                readonly type: "string";
                readonly description: "Free-text address to geocode (e.g. '10 Downing Street, London' or '1600 Amphitheatre Parkway, Mountain View, CA').";
            };
            readonly countrycode: {
                readonly type: "string";
                readonly description: "ISO 3166-1 alpha-2 country code to restrict results (e.g. 'gb', 'us', 'de'). Omit for global search.";
            };
            readonly limit: {
                readonly type: "number";
                readonly description: "Max results to return (1–10, default 1).";
            };
            readonly lang: {
                readonly type: "string";
                readonly description: "ISO 639-1 language code for result labels (default 'en').";
            };
        };
        readonly required: readonly ["address"];
    };
};
export declare const autocompleteAddressTool: {
    readonly name: "autocomplete_address";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly text: {
                readonly type: "string";
                readonly description: "Partial address string to autocomplete (e.g. '10 Down' or 'Rue de la P'). Minimum 2 characters.";
            };
            readonly countrycode: {
                readonly type: "string";
                readonly description: "ISO 3166-1 alpha-2 to restrict results to one country (e.g. 'gb', 'us').";
            };
            readonly bias: {
                readonly type: "string";
                readonly description: "ISO 3166-1 alpha-2 to prefer results from this country without hard-filtering — useful for international checkout forms.";
            };
            readonly limit: {
                readonly type: "number";
                readonly description: "Max suggestions to return (1–10, default 5).";
            };
            readonly lang: {
                readonly type: "string";
                readonly description: "ISO 639-1 language code for result labels (default 'en').";
            };
        };
        readonly required: readonly ["text"];
    };
};
export declare const reverseGeocodeTool: {
    readonly name: "reverse_geocode";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly lat: {
                readonly type: "number";
                readonly description: "Latitude (-90 to 90), e.g. 51.5034.";
            };
            readonly lng: {
                readonly type: "number";
                readonly description: "Longitude (-180 to 180), e.g. -0.1276.";
            };
            readonly lang: {
                readonly type: "string";
                readonly description: "ISO 639-1 language code for result labels (default 'en').";
            };
        };
        readonly required: readonly ["lat", "lng"];
    };
};
export declare const geolocateIpTool: {
    readonly name: "geolocate_ip";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly ip: {
                readonly type: "string";
                readonly description: "IPv4 or IPv6 address to geolocate (e.g. '8.8.8.8').";
            };
        };
        readonly required: readonly ["ip"];
    };
};
export declare const searchNearbyPlacesTool: {
    readonly name: "search_nearby_places";
    readonly description: string;
    readonly inputSchema: {
        readonly type: "object";
        readonly properties: {
            readonly lat: {
                readonly type: "number";
                readonly description: "Centre latitude for the search (-90 to 90).";
            };
            readonly lng: {
                readonly type: "number";
                readonly description: "Centre longitude for the search (-180 to 180).";
            };
            readonly radius: {
                readonly type: "number";
                readonly description: "Search radius in metres (default 1000, max 50000).";
            };
            readonly categories: {
                readonly type: "string";
                readonly description: string;
            };
            readonly limit: {
                readonly type: "number";
                readonly description: "Max results to return (1–100, default 20).";
            };
            readonly lang: {
                readonly type: "string";
                readonly description: "ISO 639-1 language code for result labels (default 'en').";
            };
        };
        readonly required: readonly ["lat", "lng"];
    };
};
export declare function runGeocodeAddress(args: {
    address: string;
    countrycode?: string;
    limit?: number;
    lang?: string;
}, config: GeoConfig): Promise<string>;
export declare function runAutocompleteAddress(args: {
    text: string;
    countrycode?: string;
    bias?: string;
    limit?: number;
    lang?: string;
}, config: GeoConfig): Promise<string>;
export declare function runReverseGeocode(args: {
    lat: number;
    lng: number;
    lang?: string;
}, config: GeoConfig): Promise<string>;
export declare function runGeolocateIp(args: {
    ip: string;
}, config: GeoConfig): Promise<string>;
export declare function runSearchNearbyPlaces(args: {
    lat: number;
    lng: number;
    radius?: number;
    categories?: string;
    limit?: number;
    lang?: string;
}, config: GeoConfig): Promise<string>;
export {};
//# sourceMappingURL=geolocation.d.ts.map