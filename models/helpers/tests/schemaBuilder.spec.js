const { expect } = require("chai");

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schemaBuilder = require("../schemaBuilder");

var stringifyIncludingFunction = (object) => {
	return JSON.stringify(object, function (key, val) {
		return typeof val === "function"
			? ("" + val).replace(/(\r\n|\n|\r|\t)/gm, "")
			: val;
	});
};

describe("schema builder test", () => {
	it("could concatenate 2 schemas properly", () => {
		var testSchema1 = new Schema({
			name: {
				type: String,
				required: true,
				validate: {
					validator: function () {
						if (this.name.length === 2) {
							return this.name === "it";
						}
					},
				},
			},
		});

		var testSchema2 = new Schema({
			gender: {
				type: String,
				enum: ["male", "female", "any"],
			},
		});

		var combinedSchema = schemaBuilder.contatenateSchemas(
			testSchema1,
			testSchema2
		);
		var combinedSchemaObject = combinedSchema.obj;
		var trueCombinedSchema = new Schema({
			name: {
				type: String,
				required: true,
				validate: {
					validator: function () {
						if (this.name.length === 2) {
							return this.name === "it";
						}
					},
				},
			},
			gender: {
				type: String,
				enum: ["male", "female", "any"],
			},
		});

		expect(stringifyIncludingFunction(trueCombinedSchema.obj)).to.equal(
			stringifyIncludingFunction(combinedSchemaObject)
		);
	});

	it("could concatenate more than two schemas properly", () => {
		var testSchema1 = new Schema({
			name: {
				type: String,
				required: true,
				validate: {
					validator: function () {
						if (this.name.length === 2) {
							return this.name === "it";
						}
					},
				},
			},
		});

		var testSchema2 = new Schema({
			gender: {
				type: String,
				enum: ["male", "female", "any"],
			},
		});

		var testSchema3 = new Schema({
			date: {
				type: Schema.Types.Date,
			},
		});

		var testSchema4 = new Schema({
			level1: {
				level2: {
					type: [
						{
							type: String,
						},
					],
					validate: {
						validator: function (value) {
							return value.length > 1;
						},
					},
				},
			},
		});

		var combinedSchema = schemaBuilder.contatenateSchemas(
			testSchema1,
			testSchema2,
			testSchema3,
			testSchema4
		);

		var combinedSchemaObject = combinedSchema.obj;

		var trueCombinedSchema = new Schema({
			name: {
				type: String,
				required: true,
				validate: {
					validator: function () {
						if (this.name.length === 2) {
							return this.name === "it";
						}
					},
				},
			},
			gender: {
				type: String,
				enum: ["male", "female", "any"],
			},
			date: {
				type: Schema.Types.Date,
			},
			level1: {
				level2: {
					type: [
						{
							type: String,
						},
					],
					validate: {
						validator: function (value) {
							return value.length > 1;
						},
					},
				},
			},
		});

		expect(stringifyIncludingFunction(trueCombinedSchema.obj)).to.equal(
			stringifyIncludingFunction(combinedSchemaObject)
		);
	});

	it("could add validator to a schema with no validator", () => {
		var testSchema = new Schema({
			room: {
				type: String,
			},
		});

		var modifiedSchema = schemaBuilder
			.modifyBaseSchema(testSchema)
			.validateWith(function (value) {
				return [
					"Orchard Commons",
					"Place Vanier",
					"Ponderosa Commons",
				].includes(value);
			});

		var expected = new Schema({
			room: {
				type: String,
				validate: {
					validator: function (value) {
						return [
							"Orchard Commons",
							"Place Vanier",
							"Ponderosa Commons",
						].includes(value);
					},
				},
			},
		});
		expect(stringifyIncludingFunction(modifiedSchema.obj)).to.equal(
			stringifyIncludingFunction(expected.obj)
		);
	});

	it("could change validator when there exists a previous one", () => {
		var testSchema = new Schema({
			room: {
				type: String,
				validate: {
					validator: function (value) {
						return [
							"Orchard Commons",
							"Place Vanier",
							"Ponderosa Commons",
						].includes(value);
					},
				},
			},
		});

		var modifiedSchema = schemaBuilder
			.modifyBaseSchema(testSchema)
			.validateWith(function (value) {
				return [
					"Orchard Commons",
					"Place Vanier",
					"totem park",
					"Marine Drive",
				].includes(value);
			});

		var expected = new Schema({
			room: {
				type: String,
				validate: {
					validator: function (value) {
						return [
							"Orchard Commons",
							"Place Vanier",
							"totem park",
							"Marine Drive",
						].includes(value);
					},
				},
			},
		});

		expect(stringifyIncludingFunction(modifiedSchema.obj)).to.equal(
			stringifyIncludingFunction(expected.obj)
		);
	});

	it("could build an array schema from a given base schema", () => {
		var testSchema = new Schema({
			room: {
				type: String,
				validate: {
					validator: function (value) {
						return [
							"Orchard Commons",
							"Place Vanier",
							"totem park",
							"Marine Drive",
						].includes(value);
					},
				},
				required: true,
			},
		});

		var modifiedSchema = schemaBuilder
			.modifyBaseSchema(testSchema)
			.ceateArraySchema(function (value) {
				return value.length >= 1;
			});

		var expected = new Schema({
			rooms: {
				type: [
					{
						type: String,
						validate: {
							validator: function (value) {
								return [
									"Orchard Commons",
									"Place Vanier",
									"totem park",
									"Marine Drive",
								].includes(value);
							},
						},
						required: true,
					},
				],
				validate: {
					validator: function (value) {
						return value.length >= 1;
					},
				},
				required: false,
			},
		});

		expect(stringifyIncludingFunction(modifiedSchema.obj)).to.equal(
			stringifyIncludingFunction(expected.obj)
		);
	});
});
