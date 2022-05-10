var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var contatenateSchemas = function (...arrayOfSchemas) {
	var schemaObjects = arrayOfSchemas.map(function (schema) {
		return schema.obj;
	});
	return new Schema(Object.assign({}, ...schemaObjects));
};

var modifyBaseSchema = (baseSchema) => {
	var baseSchemaObj = baseSchema.obj;

	if (Object.keys(baseSchemaObj).length != 1) {
		throw new Error(
			"base schema must only have 1 field, but has " +
				Object.keys(baseSchemaObj).length
		);
	}
	var propertyName = Object.keys(baseSchemaObj)[0];
	var previousObj = baseSchemaObj[propertyName];

	var validateWith = (validatorFn) => {
		return new Schema({
			[propertyName]: {
				...previousObj,
				validate: {
					validator: validatorFn,
				},
			},
		});
	};

	var setDefault = (defaultValue) => {
		return new Schema({
			[propertyName]: {
				...previousObj,
				default: defaultValue,
			},
		});
	};

	var setRequired = (isRequired) => {
		return new Schema({
			[propertyName]: {
				...previousObj,
				required: isRequired,
			},
		});
	};

	var ceateArraySchema = (arrayValidator, required) => {
		if (arrayValidator === undefined) {
			throw new Error(
				"must pass in arrayValidator! If you don't want validator, pass in null"
			);
		}
		if (arrayValidator === null) {
			return new Schema({
				[propertyName + "s"]: {
					type: [baseSchema.obj[propertyName]],
					required: required ? true : false,
				},
			});
		}

		return new Schema({
			[propertyName + "s"]: {
				type: [baseSchema.obj[propertyName]],
				validate: {
					validator: arrayValidator,
				},
				required: required ? true : false,
			},
		});
	};

	return {
		baseSchema,
		validateWith,
		setDefault,
		setRequired,
		ceateArraySchema,
	};
};

module.exports = { contatenateSchemas, modifyBaseSchema };
