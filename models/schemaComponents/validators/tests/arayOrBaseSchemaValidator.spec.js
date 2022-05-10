const { expect } = require("chai");
var arrayOrBaseSchemaValidator = require("../arrayOrBaseSchemaValidator");

describe("array or base schema validator test", () => {
	describe("no duplicate and not empty validator test", () => {
		it("returns false for empty array", () => {
			var result =
				arrayOrBaseSchemaValidator.noDuplicateAndNotEmptyValidator([]);

			expect(result).to.be.false;
		});

		it("returns false for duplicate present", () => {
			var result =
				arrayOrBaseSchemaValidator.noDuplicateAndNotEmptyValidator([
					"a",
					"a",
				]);

			expect(result).to.be.false;

			result = arrayOrBaseSchemaValidator.noDuplicateAndNotEmptyValidator(
				["a", "b", "a"]
			);

			expect(result).to.be.false;

			result = arrayOrBaseSchemaValidator.noDuplicateAndNotEmptyValidator(
				["b", "a", "c", "a"]
			);

			expect(result).to.be.false;

			result = arrayOrBaseSchemaValidator.noDuplicateAndNotEmptyValidator(
				["a", "b", "c", "b", "d", "b"]
			);

			expect(result).to.be.false;

			result = arrayOrBaseSchemaValidator.noDuplicateAndNotEmptyValidator(
				[1, 2, 3, 4, 5, 4]
			);

			expect(result).to.be.false;
		});

		it("returns true for no duplicate and not empty arrays", () => {
			var result =
				arrayOrBaseSchemaValidator.noDuplicateAndNotEmptyValidator([
					"a",
					"b",
					"c",
				]);

			expect(result).to.be.true;

			result = arrayOrBaseSchemaValidator.noDuplicateAndNotEmptyValidator(
				[1, "1", 2]
			);

			expect(result).to.be.true;

			result = arrayOrBaseSchemaValidator.noDuplicateAndNotEmptyValidator(
				[1, 2, 3]
			);

			expect(result).to.be.true;

			result = arrayOrBaseSchemaValidator.noDuplicateAndNotEmptyValidator(
				[1, "2", 3]
			);

			expect(result).to.be.true;
		});
	});

	describe("is subset of collection test", () => {
		it("returns true for the subset being the whole collection", () => {
			var result = arrayOrBaseSchemaValidator.isSubsetOfCollection(
				["a", "b", "c"],
				["a", "b", "c"]
			);

			expect(result).to.be.true;

			result = arrayOrBaseSchemaValidator.isSubsetOfCollection(
				[2, 1, 3],
				[1, 3, 2]
			);

			expect(result).to.be.true;

			result = arrayOrBaseSchemaValidator.isSubsetOfCollection(
				["1", 1, "a"],
				[1, "a", "1"]
			);

			expect(result).to.be.true;
		});

		it("returns true for the subset being empty", () => {
			var result = arrayOrBaseSchemaValidator.isSubsetOfCollection(
				[],
				["a", "b", "c"]
			);

			expect(result).to.be.true;
		});

		it("returns true for the subset being a proper set", () => {
			var result = arrayOrBaseSchemaValidator.isSubsetOfCollection(
				["a", "c"],
				["a", "b", "c"]
			);

			expect(result).to.be.true;

			result = arrayOrBaseSchemaValidator.isSubsetOfCollection(
				[1, "a"],
				[1, "a", "b"]
			);

			expect(result).to.be.true;
		});

		it("returns false for not being a subset of the collection", () => {
			var result = arrayOrBaseSchemaValidator.isSubsetOfCollection(
				["a", "d"],
				["a", "b", "c"]
			);

			expect(result).to.be.false;

			result = arrayOrBaseSchemaValidator.isSubsetOfCollection(
				["a"],
				["b", "c", "d"]
			);

			expect(result).to.be.false;
		});
	});
});
