var schemaBuilder = require("../helpers/schemaBuilder");
var arrayOrBaseValidator = require("./validators/arrayOrBaseSchemaValidator");

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

module.exports = createPreferenceArraySchema;
