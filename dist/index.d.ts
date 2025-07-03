import csvtojson from "csvtojson";
import { Readable } from "stream";
export interface CsvParsingResult {
    headers: string[];
    data: any[];
    [key: string]: any;
}
export interface CsvOptions {
    [key: string]: any;
}
/**
 * Palau CSV to JSON Wrapper
 * A minimal wrapper around the csvtojson package
 */
export declare class PalauCsvToJsonWrapper {
    private options;
    constructor(options?: CsvOptions);
    /**
     * Buffer stream content to string
     * @param stream - The stream to buffer
     * @returns Promise that resolves to the stream content as string
     * @private
     */
    private _bufferStream;
    /**
     * Process CSV with header validation
     * @param input - CSV string, file path, or stream
     * @param options - Options to override defaults
     * @param inputType - Type of input: 'string', 'file', or 'stream'
     * @returns Promise that resolves to the processed CSV data with headers
     * @private
     */
    private _parseCsv;
    /**
     * Convert CSV string to JSON
     * @param csvString - The CSV string to convert
     * @param options - Options to override defaults
     * @returns Promise that resolves to the processed CSV data with headers
     */
    fromString(csvString: string, options?: CsvOptions): Promise<CsvParsingResult>;
    /**
     * Convert CSV file to JSON
     * @param filePath - Path to the CSV file
     * @param options - Options to override defaults
     * @returns Promise that resolves to the processed CSV data with headers
     */
    fromFile(filePath: string, options?: CsvOptions): Promise<CsvParsingResult>;
    /**
     * Convert CSV stream to JSON
     * @param stream - The CSV stream to convert
     * @param options - Options to override defaults
     * @returns Promise that resolves to the processed CSV data with headers
     */
    fromStream(stream: Readable, options?: CsvOptions): Promise<CsvParsingResult>;
    /**
     * Get the underlying csvtojson instance for advanced usage
     * @returns The csvtojson instance
     */
    getCsvToJson(): typeof csvtojson;
    /**
     * Create a new instance with different default options
     * @param options - New default options
     * @returns New wrapper instance
     */
    withOptions(options: CsvOptions): PalauCsvToJsonWrapper;
    /**
     * Clean a single processed header title (remove blank_x or duplicate_x_ prefixes)
     * @param header - The processed header string
     * @returns The cleaned header string
     */
    static cleanHeaderTitle(header: string): string;
}
export default PalauCsvToJsonWrapper;
export declare const defaultInstance: PalauCsvToJsonWrapper;
export { csvtojson };
//# sourceMappingURL=index.d.ts.map