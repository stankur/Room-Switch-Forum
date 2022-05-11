var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schemaBuilder = require("../../helpers/schemaBuilder");

var createPreferenceSchema = require("../helper").createPreferenceArraySchema;

var allResidenceAreas =
	require("../../../staticInformation/residences").getResidenceNames();

var baseResidenceArea = new Schema({
	residenceArea: {
		type: String,
	},
});

var residenceAreaRoomSchema = (() => {
	var validatedResidenceArea = schemaBuilder
		.modifyBaseSchema(baseResidenceArea)
		.validateWith(function (residenceArea) {
			return allResidenceAreas.includes(residenceArea);
		});

	var setRequiredResidenceArea = schemaBuilder
		.modifyBaseSchema(validatedResidenceArea)
		.setRequired(true);

	return setRequiredResidenceArea;
})();

var residenceAreaPreferenceSchema = createPreferenceSchema(
	baseResidenceArea,
	allResidenceAreas
);

module.exports = {
	residenceAreaRoomSchema,
	residenceAreaPreferenceSchema,
};
