var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var residencesModule = require("../../staticInformation/residences");
var accomodationValidator = require("./validators/accomodationValidator");
var floorValidator = require("./validators/floorValidator");

var accomodationInfoSchemaGenerator = function (isRequired) {
	var parentSchema = new Schema({
		residenceArea: {
			type: String,
			enum: [...residencesModule.getResidenceNames()],
			required: isRequired,
		},
	});

	var generalInfoSchema = function (parentSchemaObject) {
		return new Schema({
			generalInfo: {
				residenceType: {
					type: String,
					default: residencesModule.getTypeOf(
						parentSchemaObject.residenceArea
					),
					validate: {
						validator: function (value) {
							return (
								value ===
								residencesModule.getTypeOf(
									parentSchemaObject.residenceArea
								)
							);
						},
					},
				},
				session: {
					type: String,
					validate: {
						validator: accomodationValidator(
							"sessions",
							parentSchemaObject.residenceArea
						),
					},
					required: isRequired,
				},
			},
		});
	};

	var roomInfoSchema = function (parentSchemaObject) {
		return new Schema({
			roomInfo: {
				room: {
					type: String,
					validate: {
						validator: accomodationValidator(
							"rooms",
							parentSchemaObject.residenceArea
						),
					},
					required: isRequired,
				},
				floor: {
					type: Schema.Types.Mixed,
					validate: {
						validator: floorValidator,
					},
					required: isRequired,
				},
				washroom: {
					type: String,
					enum: ["Private", "Communal"],
					required: isRequired,
				},
				building: {
					type: String,
					validate: {
						validator: accomodationValidator(
							"buildings",
							parentSchemaObject.residenceArea
						),
					},
					required: isRequired,
				},
			},
		});
	};

	var eligibilityInfoSchema = function (parentSchemaObject) {
		return new Schema({
			eligibilityInfo: {
				minimumAge: {
					type: Number,
					default: residencesModule.getMinimumAgeOf(
						parentSchemaObject.residenceArea
					),
					validate: {
						validator: function (value) {
							return (
								value ===
								residencesModule.getMinimumAgeOf(
									parentSchemaObject.residenceArea
								)
							);
						},
					},
				},
				allowedGender: {
					type: String,
					enum: ["Male", "Female", "Any"],
					required: isRequired,
				},
			},
		});
	};

	var parentSchemaObject = parentSchema.obj;
	return new Schema(
		Object.assign(
			parentSchemaObject,
			generalInfoSchema(parentSchemaObject).obj,
			roomInfoSchema(parentSchemaObject).obj,
			eligibilityInfoSchema(parentSchemaObject).obj
		)
	);
};

module.exports = accomodationInfoSchemaGenerator;
