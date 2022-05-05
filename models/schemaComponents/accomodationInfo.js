var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var residencesModule = require("../../staticInformation/residences");
var accomodationValidator = require("./validators/accomodationValidator");
var floorValidator = require("./validators/floorValidator").floorValidator;

var residenceTypes = require("../../staticInformation/residenceTypes");
var sessionTypes = require("../../staticInformation/sessionTypes");
var roomTypes = require("../../staticInformation/roomTypes");
var minimumAges = require("../../staticInformation/minimumAges");
var allowedGenders = require("../../staticInformation/allowedGenders");
var washrooms = require("../../staticInformation/washrooms");

var accomodationInfoSchemaGenerator = function (isRequired) {
	var parentSchema = new Schema({
		residenceArea: {
			type: String,
			enum: residencesModule.getResidenceNames(),
			required: isRequired,
		},
	});

	var generalInfoSchema = new Schema({
		generalInfo: {
			residenceType: {
				type: String,
				default: residencesModule.getTypeOf(this.residenceArea),
				validate: {
					validator: function (value) {
						if (!this.residenceArea) {
							return residenceTypes.includes(value);
						}
						return (
							value ===
							residencesModule.getTypeOf(this.residenceArea)
						);
					},
				},
			},
			session: {
				type: String,
				validate: {
					validator: function (value) {
						if (!this.residenceArea) {
							return sessionTypes.includes(value);
						}
						return accomodationValidator(
							"sessions",
							this.residenceArea
						)(value);
					},
				},
				required: isRequired,
			},
		},
	});

	var roomInfoSchema = new Schema({
		roomInfo: {
			room: {
				type: String,
				validate: {
					validator: function (value) {
						if (!this.residenceArea) {
							return roomTypes.includes(value);
						}
						return accomodationValidator(
							"rooms",
							this.residenceArea
						)(value);
					},
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
				enum: washrooms,
				required: isRequired,
			},
			building: {
				type: String,
				validate: {
					validator: function (value) {
						if (!this.residenceArea) {
							return residencesModule
								.getAllBuildings()
								.includes(value);
						}
						return accomodationValidator(
							"buildings",
							this.residenceArea
						)(value);
					},
				},
				required: isRequired,
			},
		},
	});

	var eligibilityInfoSchema = new Schema({
		eligibilityInfo: {
			minimumAge: {
				type: Number,
				default: residencesModule.getMinimumAgeOf(this.residenceArea),
				validate: {
					validator: function (value) {
						if (!this.residenceArea) {
							return minimumAges.includes(value);
						}
						return (
							value ===
							residencesModule.getMinimumAgeOf(this.residenceArea)
						);
					},
				},
			},
			allowedGender: {
				type: String,
				enum: allowedGenders,
				required: isRequired,
			},
		},
	});

	return new Schema(
		Object.assign(
			parentSchema.obj,
			generalInfoSchema.obj,
			roomInfoSchema.obj,
			eligibilityInfoSchema.obj
		)
	);
};

module.exports = accomodationInfoSchemaGenerator;
