"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
async function basicExample() {
    console.log("📊 Basic CSV to JSON Example (TypeScript)\n");
    // Create a wrapper instance
    const wrapper = new index_1.default();
    // Sample CSV data
    const csvData = `id,name,email,department
1,John Doe,john.doe@company.com,Engineering
2,Jane Smith,jane.smith@company.com,Marketing
3,Bob Johnson,bob.johnson@company.com,Sales
4,Alice Brown,alice.brown@company.com,HR`;
    try {
        // Convert CSV to JSON
        const result = await wrapper.fromString(csvData);
        console.log("✅ CSV converted to JSON:");
        console.log("Headers:", result.headers);
        console.log("Data:", JSON.stringify(result.data, null, 2));
        // Access specific data
        console.log("\n📋 Employee count:", result.data.length);
        console.log("👤 First employee:", result.data[0]?.name);
    }
    catch (error) {
        console.error("❌ Error:", error instanceof Error ? error.message : error);
    }
}
// Run the example
basicExample();
//# sourceMappingURL=basic-usage.js.map