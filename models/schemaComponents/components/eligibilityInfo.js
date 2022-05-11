var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schemaBuilder = require("../../helpers/schemaBuilder");
var createPreferenceSchema = require("../helper").createPreferenceArraySchema;
var createIntervalSchema = require("../helper").createIntervalSchema;

var residencesModule = require("../../../staticInformation/residences");

var allMinimumAges = require("../../../staticInformation/minimumAges");
var allGenders = require("../../../staticInformation/allowedGenders");

var baseMinimumAge = new Schema({
	minimumAge: {
		type: Schema.Types.Mixed,
	},
});

var minimumAge = (() => {
	var validatedMinimumAge = schemaBuilder
		.modifyBaseSchema(baseMinimumAge)
		.validateWith(function (value) {
			return (
				value ===
				residencesModule.getMinimumAgeOf(this.parent().residenceArea)
			);
		});

	var setDefaultMinimumAge = schemaBuilder
		.modifyBaseSchema(validatedMinimumAge)
		.setDefault(function () {
			return residencesModule.getMinimumAgeOf(
				this.parent().residenceArea
			);
		});

	return setDefaultMinimumAge;
})();

var minimumAges = createIntervalSchema(baseMinimumAge);

var baseAllowedGender = new Schema({
	allowedGender: {
		type: String,
	},
});

var allowedGender = (() => {
	var validatedAllowedGender = schemaBuilder
		.modifyBaseSchema(baseAllowedGender)
		.validateWith(function (value) {
			return allGenders.includes(value);
		});

	var setRequiredAllowedGender = schemaBuilder
		.modifyBaseSchema(validatedAllowedGender)
		.setRequired(true);

	return setRequiredAllowedGender;
})();

var allowedGenders = createPreferenceSchema(baseAllowedGender, allGenders);

var eligibilityInfoRoomSchema = new Schema({
	eligibilityInfo: {
		type: schemaBuilder.contatenateSchemas(minimumAge, allowedGender),
		required: true,
	},
});

var eligibilityInfoPreferenceSchema = new Schema({
	eligibilityInfo: {
		type: schemaBuilder.contatenateSchemas(minimumAges, allowedGenders),
		default: () => ({}),
	},
});

module.exports = {
	eligibilityInfoRoomSchema,
	eligibilityInfoPreferenceSchema,
};
