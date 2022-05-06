var mongoose = require("mongoose");

var schemaBuilder = require("./helpers/schemaBuilder");

var residenceAreaRoomSchema =
	require("./schemaComponents/components/residenceArea").residenceAreaRoomSchema;
var generalInfoRoomSchema =
	require("./schemaComponents/components/generalInfo").generalInfoRoomSchema;
var roomInfoRoomSchema =
	require("./schemaComponents/components/roomInfo").roomInfoRoomSchema;
var eligibilityInfoRoomSchema =
	require("./schemaComponents/components/eligibilityInfo").eligibilityInfoRoomSchema;

var RoomSchema = schemaBuilder.contatenateSchemas(
	residenceAreaRoomSchema,
	generalInfoRoomSchema,
	roomInfoRoomSchema,
	eligibilityInfoRoomSchema
);

module.exports = mongoose.model("Room", RoomSchema);
