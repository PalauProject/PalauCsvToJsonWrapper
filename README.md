# Palau CSV to JSON Wrapper

A powerful TypeScript wrapper around the `csvtojson` package that provides enhanced functionality for CSV to JSON conversion with automatic header validation and processing.

## Features

-   **TypeScript Support**: Full TypeScript support with proper type definitions
-   **Enhanced CSV Processing**: Built on top of the reliable `csvtojson` package
-   **Automatic Header Validation**: Handles blank headers and duplicate headers automatically
-   **Flexible Configuration**: Easy-to-use options system
-   **Multiple Input Sources**: Support for strings, files, and streams
-   **Type Safety**: Complete TypeScript support with interfaces and type definitions

## Installation

```bash
npm install palau-csvtojson-wrapper
```

## Quick Start

```typescript
import PalauCsvToJsonWrapper from "palau-csvtojson-wrapper";

// Create a wrapper instance
const wrapper = new PalauCsvToJsonWrapper();

// Convert CSV string to JSON
const csvString = `name,age,city
John,25,New York
Jane,30,Los Angeles`;

const result = await wrapper.fromString(csvString);
console.log("Headers:", result.headers);
console.log("Data:", result.data);
// Output:
// Headers: ['name', 'age', 'city']
// Data: [
//   { name: 'John', age: '25', city: 'New York' },
//   { name: 'Jane', age: '30', city: 'Los Angeles' }
// ]
```

## API Reference

### Constructor

```typescript
new PalauCsvToJsonWrapper(options?: CsvOptions)
```

**Options:**

-   All standard `csvtojson` options are supported
-   `delimiter` (string): CSV delimiter (default: ',')
-   `quote` (string): Quote character (default: '"')
-   `escape` (string): Escape character (default: '"')
-   `includeEmptyRows` (boolean): Include empty rows (default: false)
-   `ignoreEmpty` (boolean): Ignore empty values (default: true)
-   `trim` (boolean): Trim whitespace (default: true)

### Methods

#### `fromString(csvString: string, options?: CsvOptions): Promise<CsvProcessingResult>`

Convert a CSV string to JSON.

```typescript
const result = await wrapper.fromString(csvString, options);
```

#### `fromFile(filePath: string, options?: CsvOptions): Promise<CsvProcessingResult>`

Convert a CSV file to JSON.

```typescript
const result = await wrapper.fromFile("./data.csv", options);
```

#### `fromStream(stream: Readable, options?: CsvOptions): Promise<CsvProcessingResult>`

Convert a CSV stream to JSON.

```typescript
import { createReadStream } from "fs";
const stream = createReadStream("./data.csv");
const result = await wrapper.fromStream(stream, options);
```

#### `withOptions(options: CsvOptions): PalauCsvToJsonWrapper`

Create a new instance with different default options.

```typescript
const customWrapper = wrapper.withOptions({
	delimiter: ";",
	trim: true,
});
```

#### `getCsvToJson(): typeof csvtojson`

Get the underlying `csvtojson` instance for advanced usage.

### Types

```typescript
interface CsvProcessingResult {
	headers: string[];
	data: any[];
}

interface CsvOptions {
	[key: string]: any;
}
```

## Usage Examples

### Basic Usage

```typescript
import PalauCsvToJsonWrapper from "palau-csvtojson-wrapper";

const wrapper = new PalauCsvToJsonWrapper();
const csvData = `id,name,email
1,John Doe,john@example.com
2,Jane Smith,jane@example.com`;

const result = await wrapper.fromString(csvData);
console.log("Headers:", result.headers);
console.log("Data:", result.data);
```

### Automatic Header Processing

The wrapper automatically handles problematic headers:

```typescript
const wrapper = new PalauCsvToJsonWrapper();

// CSV with blank headers (field1, field2, etc.)
const csvWithBlankHeaders = `field1,field2,name,field3
John,25,Smith,Engineer
Jane,30,Jones,Designer`;

const result = await wrapper.fromString(csvWithBlankHeaders);
console.log("Headers:", result.headers);
// Output: ['blank_0', 'blank_1', 'name', 'blank_3']

// CSV with duplicate headers
const csvWithDuplicates = `name,age,name,city
John,25,Smith,New York
Jane,30,Jones,Los Angeles`;

const result2 = await wrapper.fromString(csvWithDuplicates);
console.log("Headers:", result2.headers);
// Output: ['duplicate_0_name', 'age', 'duplicate_2_name', 'city']
```

### Custom Options

```typescript
const wrapper = new PalauCsvToJsonWrapper({
	delimiter: ";",
	trim: true,
});

const csvData = `name;age;city
John;25;New York
Jane;30;Los Angeles`;

const result = await wrapper.fromString(csvData);
```

### Working with Files

```typescript
const wrapper = new PalauCsvToJsonWrapper();
const result = await wrapper.fromFile("./data.csv");
console.log("Headers:", result.headers);
console.log("Data:", result.data);
```

### Working with Streams

```typescript
import { createReadStream } from "fs";
import PalauCsvToJsonWrapper from "palau-csvtojson-wrapper";

const wrapper = new PalauCsvToJsonWrapper();
const stream = createReadStream("./data.csv");
const result = await wrapper.fromStream(stream);
```

## Header Processing

The wrapper automatically processes CSV headers to handle common issues:

### Blank Headers

Headers like `field1`, `field2`, etc. are automatically renamed to `blank_0`, `blank_1`, etc.

### Duplicate Headers

Duplicate headers are renamed to include their position: `duplicate_index_originalname`

### Valid Headers

Valid headers are kept as-is.

## Error Handling

The wrapper provides comprehensive error handling:

```typescript
try {
	const result = await wrapper.fromString(invalidCsv);
} catch (error) {
	console.error(
		"Conversion failed:",
		error instanceof Error ? error.message : error
	);
}
```

## Advanced Usage

### Accessing the Original csvtojson

```typescript
import { csvtojson } from "palau-csvtojson-wrapper";

// Use the original csvtojson for advanced features
const converter = csvtojson({
	checkType: true,
	flatKeys: true,
});
```

### Using Default Instance

```typescript
import { defaultInstance } from "palau-csvtojson-wrapper";

// Use the default instance
const result = await defaultInstance.fromString(csvString);
```

## Development

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Running Tests

```bash
npm test
```

### Running Examples

```bash
npm run example
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC

## Dependencies

-   `csvtojson`: ^2.0.10
-   `@types/node`: ^20.0.0 (dev)
-   `typescript`: ^5.0.0 (dev)
