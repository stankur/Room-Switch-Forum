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
				[propertyName]: {
					type: [baseSchema.obj[propertyName]],
					required: required ? true : false,
				},
			});
		}

		return new Schema({
			[propertyName]: {
				type: [baseSchema.obj[propertyName]],
				validate: {
					validator: arrayValidator,
				},
				required: required ? true : false,
			},
		});
	};

	var createIntervalSchema = (intervalValidator, required) => {
		if (intervalValidator === undefined) {
			throw new console.error(
				"must pass in intervalValidator! If you don't want validator, pass in null"
			);
		}

		if (intervalValidator === null) {
			return new Schema({
				[propertyName]: {
					type: {
						spec: {
							type: String,
							validator: {
								validate: function (value) {
									return value === "Interval";
								},
							},
							default: "Interval",
						},

						criteria: {
							type: [Schema.Types.Mixed],
							default: [1, "Infinity"],
						},
					},
					required: required ? true : false,
				},
			});
		}

		return new Schema({
			[propertyName]: {
				type: {
					spec: {
						type: String,
						validator: {
							validate: function (value) {
								return value === "Interval";
							},
						},
						default: "Interval",
					},

					criteria: {
						type: [Schema.Types.Mixed],
						validator: {
							validate: intervalValidator,
						},
						default: [1, "Infinity"],
					},
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
		createIntervalSchema,
	};
};

module.exports = { contatenateSchemas, modifyBaseSchema };
