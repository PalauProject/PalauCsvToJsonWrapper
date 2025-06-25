import PalauCsvToJsonWrapper from "../index";

async function advancedExample() {
	console.log("🚀 Advanced CSV to JSON Example (TypeScript)\n");

	// Create a wrapper instance
	const wrapper = new PalauCsvToJsonWrapper();

	// Sample CSV data with problematic headers
	const csvData = `,,name,,age,age
John,25,Smith,Engineer,30,30
Jane,30,Jones,Designer,28,28
Bob,35,field5,Manager,32,32`;

	try {
		// Convert CSV to JSON with automatic header processing
		const result = await wrapper.fromString(csvData);

		console.log("✅ Processed CSV data:");
		console.log("Original headers would be: '', '', name, '', age, age");
		console.log("Processed headers:", result.headers);
		console.log("Data:", JSON.stringify(result.data, null, 2));

		// Analyze the results
		console.log("\n📊 Analysis:");
		console.log(`Total records processed: ${result.data.length}`);

		// Show how headers were transformed
		console.log("\n🔧 Header Transformations:");
		console.log("- '' → blank_0 (blank header)");
		console.log("- '' → blank_1 (blank header)");
		console.log("- name → name (kept as is)");
		console.log("- '' → blank_3 (blank header)");
		console.log("- age → duplicate_5_age (duplicate header)");
		console.log("- age → duplicate_6_age (duplicate header)");
	} catch (error) {
		console.error(
			"❌ Error:",
			error instanceof Error ? error.message : error
		);
	}
}

// Run the example
advancedExample();
