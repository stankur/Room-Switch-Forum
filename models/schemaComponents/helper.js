var schemaBuilder = require("../helpers/schemaBuilder");
var arrayOrBaseValidator = require("./validators/arrayOrBaseSchemaValidator");

var createPreferenceArraySchema = function (baseShema, allPossibilites) {
	var validatedBase = schemaBuilder
		.modifyBaseSchema(baseShema)
		.validateWith(function (value) {
			return arrayOrBaseValidator.isSubsetOfCollection(
				value,
				allPossibilites
			);
		});

	var arrayOfBase = schemaBuilder
		.modifyBaseSchema(validatedBase)
		.ceateArraySchema(arrayOrBaseValidator.noDuplicateAndNotEmptyValidator);

	var setDefaultArrayOfBase = schemaBuilder
		.modifyBaseSchema(arrayOfBase)
		.setDefault(allPossibilites);

	return setDefaultArrayOfBase;
};

module.exports = createPreferenceArraySchema;
