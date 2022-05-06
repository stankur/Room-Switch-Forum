var schemaBuilder = require("../helpers/schemaBuilder");

var residenceAreaPreferenceSchema =
	require("../schemaComponents/components/residenceArea").residenceAreaPreferenceSchema;
var generalInfoPreferenceSchema =
	require("../schemaComponents/components/generalInfo").generalInfoPreferenceSchema;
var roomInfoPreferenceSchema =
	require("../schemaComponents/components/roomInfo").roomInfoPreferenceSchema;
var eligibilityInfoRoomSchema =
	require("../schemaComponents/components/eligibilityInfo").eligibilityInfoPreferenceSchema;

module.exports = schemaBuilder.contatenateSchemas(
	residenceAreaPreferenceSchema,
	generalInfoPreferenceSchema,
	roomInfoPreferenceSchema,
	eligibilityInfoRoomSchema
);
