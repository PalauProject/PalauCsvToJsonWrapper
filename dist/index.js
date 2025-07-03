"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvtojson = exports.defaultInstance = exports.PalauCsvToJsonWrapper = void 0;
const csvtojson_1 = __importDefault(require("csvtojson"));
exports.csvtojson = csvtojson_1.default;
/**
 * Palau CSV to JSON Wrapper
 * A minimal wrapper around the csvtojson package
 */
class PalauCsvToJsonWrapper {
    constructor(options = {}) {
        this.options = options;
    }
    /**
     * Buffer stream content to string
     * @param stream - The stream to buffer
     * @returns Promise that resolves to the stream content as string
     * @private
     */
    async _bufferStream(stream) {
        return new Promise((resolve, reject) => {
            let data = "";
            stream.on("data", (chunk) => {
                data += chunk.toString();
            });
            stream.on("end", () => {
                resolve(data);
            });
            stream.on("error", (error) => {
                reject(error);
            });
        });
    }
    /**
     * Process CSV with header validation
     * @param input - CSV string, file path, or stream
     * @param options - Options to override defaults
     * @param inputType - Type of input: 'string', 'file', or 'stream'
     * @returns Promise that resolves to the processed CSV data with headers
     * @private
     */
    async _parseCsv(input, options = {}, inputType = "string") {
        const mergedOptions = { ...this.options, ...options };
        // For streams, buffer the content first
        let csvContent;
        if (inputType === "stream") {
            csvContent = await this._bufferStream(input);
        }
        // First pass: extract headers
        let colHeaders = [];
        if (inputType === "string") {
            await (0, csvtojson_1.default)(mergedOptions)
                .fromString(input)
                .on("header", (headers) => (colHeaders = headers));
        }
        else if (inputType === "file") {
            await (0, csvtojson_1.default)(mergedOptions)
                .fromFile(input)
                .on("header", (headers) => (colHeaders = headers));
        }
        else if (inputType === "stream") {
            await (0, csvtojson_1.default)(mergedOptions)
                .fromString(csvContent)
                .on("header", (headers) => (colHeaders = headers));
        }
        // Process headers to handle blank and duplicate headers
        const validHeaders = colHeaders.map((header, i, arr) => {
            if (header === "" || /^field\d+$/.test(header))
                return `blank_${i}`;
            if (arr.some((h, j) => j !== i && h === header))
                return `duplicate_${i}_${header}`;
            return header;
        });
        // Second pass: convert with validated headers
        const finalOptions = {
            ...mergedOptions,
            noheader: true,
            headers: validHeaders,
        };
        let data = [];
        if (inputType === "string") {
            data = await (0, csvtojson_1.default)(finalOptions).fromString(input);
        }
        else if (inputType === "file") {
            data = await (0, csvtojson_1.default)(finalOptions).fromFile(input);
        }
        else if (inputType === "stream") {
            data = await (0, csvtojson_1.default)(finalOptions).fromString(csvContent);
        }
        else
            throw new Error(`Unsupported input type: ${inputType}`);
        return {
            headers: validHeaders,
            data: data.slice(1), // Remove the header row
        };
    }
    /**
     * Convert CSV string to JSON
     * @param csvString - The CSV string to convert
     * @param options - Options to override defaults
     * @returns Promise that resolves to the processed CSV data with headers
     */
    async fromString(csvString, options = {}) {
        return await this._parseCsv(csvString, options, "string");
    }
    /**
     * Convert CSV file to JSON
     * @param filePath - Path to the CSV file
     * @param options - Options to override defaults
     * @returns Promise that resolves to the processed CSV data with headers
     */
    async fromFile(filePath, options = {}) {
        return await this._parseCsv(filePath, options, "file");
    }
    /**
     * Convert CSV stream to JSON
     * @param stream - The CSV stream to convert
     * @param options - Options to override defaults
     * @returns Promise that resolves to the processed CSV data with headers
     */
    async fromStream(stream, options = {}) {
        return await this._parseCsv(stream, options, "stream");
    }
    /**
     * Get the underlying csvtojson instance for advanced usage
     * @returns The csvtojson instance
     */
    getCsvToJson() {
        return csvtojson_1.default;
    }
    /**
     * Create a new instance with different default options
     * @param options - New default options
     * @returns New wrapper instance
     */
    withOptions(options) {
        return new PalauCsvToJsonWrapper({ ...this.options, ...options });
    }
    /**
     * Clean a single processed header title (remove blank_x or duplicate_x_ prefixes)
     * @param header - The processed header string
     * @returns The cleaned header string
     */
    static cleanHeaderTitle(header) {
        if (/^blank_\d+$/.test(header))
            return "";
        const dupMatch = header.match(/^duplicate_\d+_(.*)$/);
        if (dupMatch)
            return dupMatch[1] ?? "";
        return header;
    }
}
exports.PalauCsvToJsonWrapper = PalauCsvToJsonWrapper;
// Export the wrapper class
exports.default = PalauCsvToJsonWrapper;
// Also export a default instance for convenience
exports.defaultInstance = new PalauCsvToJsonWrapper();
//# sourceMappingURL=index.js.map