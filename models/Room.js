var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var residencesModule = require("../staticInformation/residences");

var schemaBuilder = require("./helpers/schemaBuilder");

var generalInfoRoomSchema =
	require("./schemaComponents/components/generalInfo").generalInfoRoomSchema;
var roomInfoRoomSchema =
	require("./schemaComponents/components/roomInfo").roomInfoRoomSchema;
var eligibilityInfoRoomSchema =
	require("./schemaComponents/components/eligibilityInfo").eligibilityInfoRoomSchema;

var RoomParentSchema = new Schema({
	residenceArea: {
		type: String,
		enum: residencesModule.getResidenceNames(),
		required: true,
	},
});

var RoomSchema = schemaBuilder.contatenateSchemas(
	RoomParentSchema,
	generalInfoRoomSchema,
	roomInfoRoomSchema,
	eligibilityInfoRoomSchema
);

module.exports = mongoose.model("Room", RoomSchema);
