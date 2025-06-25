import csvtojson from "csvtojson";
import { Readable } from "stream";

export interface CsvProcessingResult {
	headers: string[];
	data: any[];
}

export interface CsvOptions {
	[key: string]: any;
}

/**
 * Palau CSV to JSON Wrapper
 * A minimal wrapper around the csvtojson package
 */
export class PalauCsvToJsonWrapper {
	private options: CsvOptions;

	constructor(options: CsvOptions = {}) {
		this.options = options;
	}

	/**
	 * Buffer stream content to string
	 * @param stream - The stream to buffer
	 * @returns Promise that resolves to the stream content as string
	 * @private
	 */
	private async _bufferStream(stream: Readable): Promise<string> {
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
	private async _processCsv(
		input: string | Readable,
		options: CsvOptions = {},
		inputType: "string" | "file" | "stream" = "string"
	): Promise<CsvProcessingResult> {
		const mergedOptions = { ...this.options, ...options };

		// For streams, buffer the content first
		let csvContent: string;
		if (inputType === "stream") {
			csvContent = await this._bufferStream(input as Readable);
		}

		// First pass: extract headers
		let colHeaders: string[] = [];

		if (inputType === "string") {
			await csvtojson(mergedOptions)
				.fromString(input as string)
				.on("header", (headers: string[]) => (colHeaders = headers));
		} else if (inputType === "file") {
			await csvtojson(mergedOptions)
				.fromFile(input as string)
				.on("header", (headers: string[]) => (colHeaders = headers));
		} else if (inputType === "stream") {
			await csvtojson(mergedOptions)
				.fromString(csvContent!)
				.on("header", (headers: string[]) => (colHeaders = headers));
		}

		// Process headers to handle blank and duplicate headers
		const validHeaders = colHeaders.map(
			(header: string, i: number, arr: string[]) => {
				if (header === "" || /^field\d+$/.test(header))
					return `blank_${i}`;
				if (arr.some((h: string, j: number) => j !== i && h === header))
					return `duplicate_${i}_${header}`;
				return header;
			}
		);

		// Second pass: convert with validated headers
		const finalOptions = {
			...mergedOptions,
			noheader: true,
			headers: validHeaders,
		};

		let data: Array<{ [key: string]: any }> = [];
		if (inputType === "string") {
			data = await csvtojson(finalOptions).fromString(input as string);
		} else if (inputType === "file") {
			data = await csvtojson(finalOptions).fromFile(input as string);
		} else if (inputType === "stream") {
			data = await csvtojson(finalOptions).fromString(csvContent!);
		} else throw new Error(`Unsupported input type: ${inputType}`);

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
	async fromString(
		csvString: string,
		options: CsvOptions = {}
	): Promise<CsvProcessingResult> {
		return await this._processCsv(csvString, options, "string");
	}

	/**
	 * Convert CSV file to JSON
	 * @param filePath - Path to the CSV file
	 * @param options - Options to override defaults
	 * @returns Promise that resolves to the processed CSV data with headers
	 */
	async fromFile(
		filePath: string,
		options: CsvOptions = {}
	): Promise<CsvProcessingResult> {
		return await this._processCsv(filePath, options, "file");
	}

	/**
	 * Convert CSV stream to JSON
	 * @param stream - The CSV stream to convert
	 * @param options - Options to override defaults
	 * @returns Promise that resolves to the processed CSV data with headers
	 */
	async fromStream(
		stream: Readable,
		options: CsvOptions = {}
	): Promise<CsvProcessingResult> {
		return await this._processCsv(stream, options, "stream");
	}

	/**
	 * Get the underlying csvtojson instance for advanced usage
	 * @returns The csvtojson instance
	 */
	getCsvToJson(): typeof csvtojson {
		return csvtojson;
	}

	/**
	 * Create a new instance with different default options
	 * @param options - New default options
	 * @returns New wrapper instance
	 */
	withOptions(options: CsvOptions): PalauCsvToJsonWrapper {
		return new PalauCsvToJsonWrapper({ ...this.options, ...options });
	}
}

// Export the wrapper class
export default PalauCsvToJsonWrapper;

// Also export a default instance for convenience
export const defaultInstance = new PalauCsvToJsonWrapper();

// Export the original csvtojson for advanced usage
export { csvtojson };
