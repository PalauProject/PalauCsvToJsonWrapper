import PalauCsvToJsonWrapper, { CsvParsingResult } from "../index";
import { Readable } from "stream";

describe("PalauCsvToJsonWrapper", () => {
	let wrapper: PalauCsvToJsonWrapper;

	beforeEach(() => {
		wrapper = new PalauCsvToJsonWrapper();
	});

	describe("Constructor", () => {
		it("should create instance with default options", () => {
			const instance = new PalauCsvToJsonWrapper();
			expect(instance).toBeInstanceOf(PalauCsvToJsonWrapper);
		});

		it("should create instance with custom options", () => {
			const options = { delimiter: ";", trim: true };
			const instance = new PalauCsvToJsonWrapper(options);
			expect(instance).toBeInstanceOf(PalauCsvToJsonWrapper);
		});
	});

	describe("fromString", () => {
		it("should convert basic CSV string to JSON", async () => {
			const csvString = `name,age,city\nJohn,25,New York\nJane,30,Los Angeles`;

			const result = await wrapper.fromString(csvString);

			expect(result).toHaveProperty("headers");
			expect(result).toHaveProperty("data");
			expect(result.headers).toEqual(["name", "age", "city"]);
			expect(result.data).toHaveLength(2);
			expect(result.data[0]).toEqual({
				name: "John",
				age: "25",
				city: "New York",
			});
			expect(result.data[1]).toEqual({
				name: "Jane",
				age: "30",
				city: "Los Angeles",
			});
		});

		it("should handle blank headers (empty and fieldN)", async () => {
			const csvString = `,,name,,age,\nJohn,25,Smith,Engineer,30,New York\nJane,30,Jones,Designer,28,San Francisco`;

			const result = await wrapper.fromString(csvString);

			expect(result.headers).toEqual([
				"blank_0",
				"blank_1",
				"name",
				"blank_3",
				"age",
				"blank_5",
			]);
			expect(result.data).toHaveLength(2);
			expect(result.data[0]).toEqual({
				blank_0: "John",
				blank_1: "25",
				name: "Smith",
				blank_3: "Engineer",
				age: "30",
				blank_5: "New York",
			});
			expect(result.data[1]).toEqual({
				blank_0: "Jane",
				blank_1: "30",
				name: "Jones",
				blank_3: "Designer",
				age: "28",
				blank_5: "San Francisco",
			});
		});

		it("should handle blank headers (field1, field2, etc.)", async () => {
			const csvString = `field1,field2,name,field3\nJohn,25,Smith,Engineer\nJane,30,Jones,Designer`;

			const result = await wrapper.fromString(csvString);

			expect(result.headers).toEqual([
				"blank_0",
				"blank_1",
				"name",
				"blank_3",
			]);
			expect(result.data).toHaveLength(2);
			expect(result.data[0]).toEqual({
				blank_0: "John",
				blank_1: "25",
				name: "Smith",
				blank_3: "Engineer",
			});
			expect(result.data[1]).toEqual({
				blank_0: "Jane",
				blank_1: "30",
				name: "Jones",
				blank_3: "Designer",
			});
		});

		it("should handle duplicate headers", async () => {
			const csvString = `name,age,name,city\nJohn,25,Smith,New York\nJane,30,Jones,Los Angeles`;

			const result = await wrapper.fromString(csvString);

			expect(result.headers).toEqual([
				"duplicate_0_name",
				"age",
				"duplicate_2_name",
				"city",
			]);
			expect(result.data).toHaveLength(2);
			expect(result.data[0]).toEqual({
				duplicate_0_name: "John",
				age: "25",
				duplicate_2_name: "Smith",
				city: "New York",
			});
			expect(result.data[1]).toEqual({
				duplicate_0_name: "Jane",
				age: "30",
				duplicate_2_name: "Jones",
				city: "Los Angeles",
			});
		});

		it("should handle mixed problematic headers", async () => {
			const csvString = `field1,,age,name,field2\nJohn,,25,Brown,Engineer\nJane,,30,Doe,Designer`;

			const result = await wrapper.fromString(csvString);

			expect(result.headers).toEqual([
				"blank_0",
				"blank_1",
				"age",
				"name",
				"blank_4",
			]);
			expect(result.data).toHaveLength(2);
		});

		it("should handle empty CSV string", async () => {
			const csvString = "";

			const result = await wrapper.fromString(csvString);
			expect(result.headers).toEqual([]);
			expect(result.data).toEqual([]);
		});

		it("should handle CSV with only headers", async () => {
			const csvString = "name,age,city";

			const result = await wrapper.fromString(csvString);

			expect(result.headers).toEqual(["name", "age", "city"]);
			expect(result.data).toHaveLength(0);
		});

		it("should apply custom options", async () => {
			const customWrapper = new PalauCsvToJsonWrapper({ delimiter: ";" });
			const csvString = `name;age;city\nJohn;25;New York`;

			const result = await customWrapper.fromString(csvString);

			expect(result.headers).toEqual(["name", "age", "city"]);
			expect(result.data).toHaveLength(1);
		});

		it("should merge constructor options with method options", async () => {
			const customWrapper = new PalauCsvToJsonWrapper({ trim: true });
			const csvString = `name,age,city\nJohn , 25 , New York`;

			const result = await customWrapper.fromString(csvString, {
				delimiter: ",",
			});

			expect(result.headers).toEqual(["name", "age", "city"]);
			expect(result.data[0]).toEqual({
				name: "John",
				age: "25",
				city: "New York",
			});
		});

		it("should parse TSV (tab-separated values) correctly", async () => {
			const tsvString = `name\tage\tcity\nJohn\t25\tNew York\nJane\t30\tLos Angeles`;
			const wrapper = new PalauCsvToJsonWrapper({ delimiter: "\t" });
			const result = await wrapper.fromString(tsvString);
			expect(result.headers).toEqual(["name", "age", "city"]);
			expect(result.data).toHaveLength(2);
			expect(result.data[0]).toEqual({
				name: "John",
				age: "25",
				city: "New York",
			});
			expect(result.data[1]).toEqual({
				name: "Jane",
				age: "30",
				city: "Los Angeles",
			});
		});
	});

	describe("fromFile", () => {
		it("should convert CSV file to JSON", async () => {
			// This test would require a mock file or actual file
			// For now, we'll test that the method exists and returns the right type
			expect(typeof wrapper.fromFile).toBe("function");
		});

		it("should handle file path with custom options", async () => {
			expect(typeof wrapper.fromFile).toBe("function");
		});
	});

	describe("fromStream", () => {
		it("should convert CSV stream to JSON", async () => {
			const csvString = `name,age,city\nJohn,25,New York`;

			const stream = new Readable();
			stream.push(csvString);
			stream.push(null);

			const result = await wrapper.fromStream(stream);

			expect(result).toHaveProperty("headers");
			expect(result).toHaveProperty("data");
			expect(result.headers).toEqual(["name", "age", "city"]);
			expect(result.data).toHaveLength(1);
		});

		it("should handle stream with problematic headers", async () => {
			const csvString = `field1,name,field2\nJohn,Smith,Engineer`;

			const stream = new Readable();
			stream.push(csvString);
			stream.push(null);

			const result = await wrapper.fromStream(stream);

			expect(result.headers).toEqual(["blank_0", "name", "blank_2"]);
			expect(result.data).toHaveLength(1);
		});
	});

	describe("withOptions", () => {
		it("should create new instance with merged options", () => {
			const originalOptions = { delimiter: "," };
			const wrapper = new PalauCsvToJsonWrapper(originalOptions);

			const newWrapper = wrapper.withOptions({ trim: true });

			expect(newWrapper).toBeInstanceOf(PalauCsvToJsonWrapper);
			expect(newWrapper).not.toBe(wrapper);
		});

		it("should merge options correctly", async () => {
			const wrapper = new PalauCsvToJsonWrapper({ delimiter: "," });
			const newWrapper = wrapper.withOptions({ trim: true });

			const csvString = `name,age,city\nJohn , 25 , New York`;

			const result = await newWrapper.fromString(csvString);

			expect(result.data[0]).toEqual({
				name: "John",
				age: "25",
				city: "New York",
			});
		});
	});

	describe("getCsvToJson", () => {
		it("should return the csvtojson function", () => {
			const csvtojson = wrapper.getCsvToJson();
			expect(typeof csvtojson).toBe("function");
		});
	});

	describe("Error handling", () => {
		it("should handle malformed CSV gracefully", async () => {
			const malformedCsv = `name,age,city
John,25,"New York
Jane,30,Los Angeles`;

			await expect(wrapper.fromString(malformedCsv)).rejects.toThrow();
		});

		it("should handle incomplete rows without throwing errors", async () => {
			const incompleteCsv = `name,age,city
John,25
Jane,30,Los Angeles,extra
Bob`;

			const result = await wrapper.fromString(incompleteCsv);
			console.log(result);
			expect(result.headers).toEqual(["name", "age", "city", "blank_3"]);
			expect(result.data).toHaveLength(3);
			expect(result.data[0]).toEqual({
				name: "John",
				age: "25",
			});
			expect(result.data[1]).toEqual({
				name: "Jane",
				age: "30",
				city: "Los Angeles",
				blank_3: "extra",
			});
			expect(result.data[2]).toEqual({
				name: "Bob",
			});
		});
	});

	describe("Edge cases", () => {
		it("should handle CSV with all blank headers", async () => {
			const csvString = `field1,field2,field3\nJohn,25,Engineer\nJane,30,Designer`;

			const result = await wrapper.fromString(csvString);

			expect(result.headers).toEqual(["blank_0", "blank_1", "blank_2"]);
			expect(result.data).toHaveLength(2);
		});

		it("should handle CSV with all duplicate headers", async () => {
			const csvString = `name,name,name\nJohn,Smith,Brown\nJane,Jones,Doe`;

			const result = await wrapper.fromString(csvString);

			expect(result.headers).toEqual([
				"duplicate_0_name",
				"duplicate_1_name",
				"duplicate_2_name",
			]);
			expect(result.data).toHaveLength(2);
		});

		it("should handle single column CSV", async () => {
			const csvString = `name\nJohn\nJane`;

			const result = await wrapper.fromString(csvString);

			expect(result.headers).toEqual(["name"]);
			expect(result.data).toHaveLength(2);
			expect(result.data[0]).toEqual({ name: "John" });
		});

		it("should handle CSV with empty values", async () => {
			const csvString = `name,age,city\nJohn,,New York\nJane,30,`;

			const result = await wrapper.fromString(csvString);

			expect(result.headers).toEqual(["name", "age", "city"]);
			expect(result.data).toHaveLength(2);
			expect(result.data[0]).toEqual({
				name: "John",
				age: "",
				city: "New York",
			});
		});
	});

	describe("Type safety", () => {
		it("should return correct TypeScript types", async () => {
			const csvString = `name,age\nJohn,25`;

			const result: CsvParsingResult = await wrapper.fromString(
				csvString
			);

			expect(Array.isArray(result.headers)).toBe(true);
			expect(Array.isArray(result.data)).toBe(true);
			expect(typeof result.headers[0]).toBe("string");
			expect(typeof result.data[0]).toBe("object");
		});
	});

	describe("cleanHeaderTitle", () => {
		it("should return empty string for blank_x headers", () => {
			expect(PalauCsvToJsonWrapper.cleanHeaderTitle("blank_0")).toBe("");
			expect(PalauCsvToJsonWrapper.cleanHeaderTitle("blank_12")).toBe("");
		});

		it("should return the name for duplicate_x_name headers", () => {
			expect(
				PalauCsvToJsonWrapper.cleanHeaderTitle("duplicate_2_name")
			).toBe("name");
			expect(
				PalauCsvToJsonWrapper.cleanHeaderTitle("duplicate_0_email")
			).toBe("email");
			expect(
				PalauCsvToJsonWrapper.cleanHeaderTitle("duplicate_15_city")
			).toBe("city");
		});

		it("should return the header as-is for normal headers", () => {
			expect(PalauCsvToJsonWrapper.cleanHeaderTitle("name")).toBe("name");
			expect(PalauCsvToJsonWrapper.cleanHeaderTitle("email")).toBe(
				"email"
			);
			expect(PalauCsvToJsonWrapper.cleanHeaderTitle("city")).toBe("city");
		});
	});
});
