var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schemaBuilder = require("../../helpers/schemaBuilder");
var createPreferenceSchema = require("../helper").createPreferenceArraySchema;

var residencesModule = require("../../../staticInformation/residences");

var allResidenceTypes = require("../../../staticInformation/residenceTypes");
var allSessionTypes = require("../../../staticInformation/sessionTypes");

var accomodationValidator = require("../validators/accomodationValidator");

var baseResidenceType = new Schema({
	residenceType: {
		type: String,
	},
});

var residenceType = (() => {
	var setDefaultResidenceType = schemaBuilder
		.modifyBaseSchema(baseResidenceType)
		.setDefault(function () {
			return residencesModule.getTypeOf(this.parent().residenceArea);
		});

	var validatedResidenceType = schemaBuilder
		.modifyBaseSchema(setDefaultResidenceType)
		.validateWith(function (value) {
			return (
				value ===
				residencesModule.getTypeOf(this.parent().residenceArea)
			);
		});

	return validatedResidenceType;
})();

var residenceTypes = createPreferenceSchema(
	baseResidenceType,
	allResidenceTypes
);

var baseSession = new Schema({
	session: {
		type: String,
	},
});

var session = (() => {
	var validatedSession = schemaBuilder
		.modifyBaseSchema(baseSession)
		.validateWith(function (value) {
			return accomodationValidator(
				"sessions",
				this.parent().residenceArea
			)(value);
		});

	var setRequiredSession = schemaBuilder
		.modifyBaseSchema(validatedSession)
		.setRequired(true);

	return setRequiredSession;
})();

var sessions = createPreferenceSchema(baseSession, allSessionTypes);

var generalInfoRoomSchema = new Schema({
	generalInfo: {
		type: schemaBuilder.contatenateSchemas(residenceType, session),
		required: true,
	},
});

var generalInfoPreferenceSchema = new Schema({
	generalInfo: {
		type: schemaBuilder.contatenateSchemas(residenceTypes, sessions),
		default: () => ({}),
	},
});

module.exports = {
	generalInfoRoomSchema,
	generalInfoPreferenceSchema,
};
