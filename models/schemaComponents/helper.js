var schemaBuilder = require("../helpers/schemaBuilder");
var arrayOrBaseValidator = require("./validators/arrayOrBaseSchemaValidator");
var intervalValidator =
	require("./validators/floorValidator").isValidPositiveRange;

var createPreferenceArraySchema = function (baseShema, allPossibilites) {
	var validatedBase = schemaBuilder
		.modifyBaseSchema(baseShema)
		.validateWith(function (value) {
			return allPossibilites.includes(value);
		});

	var arrayOfBase = schemaBuilder
		.modifyBaseSchema(validatedBase)
		.ceateArraySchema(function (arrayOfBase) {
			return (
				arrayOrBaseValidator.noDuplicateAndNotEmptyValidator(
					arrayOfBase
				) &&
				arrayOrBaseValidator.isSubsetOfCollection(
					arrayOfBase,
					allPossibilites
				)
			);
		});

	var setDefaultArrayOfBase = schemaBuilder
		.modifyBaseSchema(arrayOfBase)
		.setDefault(allPossibilites);

	return setDefaultArrayOfBase;
};

var createIntervalSchema = function (baseSchema) {
	var turnedIntoIntervalSchema = schemaBuilder
		.modifyBaseSchema(baseSchema)
		.createIntervalSchema(intervalValidator);

	var setDefaultInterval = schemaBuilder
		.modifyBaseSchema(turnedIntoIntervalSchema)
		.setDefault(() => ({}));

	return setDefaultInterval;
};
module.exports = { createPreferenceArraySchema, createIntervalSchema };
