var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schemaBuilder = require("../../helpers/schemaBuilder");
var createPreferenceSchema = require("../helper").createPreferenceArraySchema;
var createIntervalSchema = require("../helper").createIntervalSchema;

var residencesModule = require("../../../staticInformation/residences");

var allRoomTypes = require("../../../staticInformation/roomTypes");
var allWashrooms = require("../../../staticInformation/washrooms");
var allBuildings = residencesModule.getAllBuildings();

var accomodationValidator = require("../validators/accomodationValidator");
var floorValidator = require("../validators/floorValidator");

var baseRoom = new Schema({
	room: {
		type: String,
	},
});

var room = (() => {
	var validatedRoom = schemaBuilder
		.modifyBaseSchema(baseRoom)
		.validateWith(function (value) {
			return accomodationValidator(
				"rooms",
				this.parent().residenceArea
			)(value);
		});

	var setRequiredRoom = schemaBuilder
		.modifyBaseSchema(validatedRoom)
		.setRequired(true);

	return setRequiredRoom;
})();

var rooms = createPreferenceSchema(baseRoom, allRoomTypes);

var baseFloor = new Schema({
	floor: {
		type: Schema.Types.Mixed,
	},
});

var floor = (() => {
	var validatedFloor = schemaBuilder
		.modifyBaseSchema(baseFloor)
		.validateWith(floorValidator.isPositiveInteger);

	var setRequiredFloor = schemaBuilder
		.modifyBaseSchema(validatedFloor)
		.setRequired(true);

	return setRequiredFloor;
})();

var floors = createIntervalSchema(baseFloor);

var baseWashroom = new Schema({
	washroom: {
		type: String,
	},
});

var washroom = (() => {
	var validatedWashroom = schemaBuilder
		.modifyBaseSchema(baseWashroom)
		.validateWith(function (value) {
			return allWashrooms.includes(value);
		});

	var setRequiredWashroom = schemaBuilder
		.modifyBaseSchema(validatedWashroom)
		.setRequired(true);

	return setRequiredWashroom;
})();

var washrooms = createPreferenceSchema(baseWashroom, allWashrooms);

var baseBuilding = new Schema({
	building: {
		type: String,
	},
});

var building = (() => {
	var validatedBuilding = schemaBuilder
		.modifyBaseSchema(baseBuilding)
		.validateWith(function (value) {
			return accomodationValidator(
				"buildings",
				this.parent().residenceArea
			)(value);
		});

	var setRequiredBuilding = schemaBuilder
		.modifyBaseSchema(validatedBuilding)
		.setRequired(function () {
			return (
				residencesModule.getBuildingsOf(this.parent().residenceArea)
					.length > 0
			);
		});

	return setRequiredBuilding;
})();

var roomInfoRoomSchema = new Schema({
	roomInfo: {
		type: schemaBuilder.contatenateSchemas(room, floor, washroom, building),
		required: true,
	},
});

var roomInfoPreferenceSchema = new Schema({
	roomInfo: {
		type: schemaBuilder.contatenateSchemas(rooms, floors, washrooms),
		default: () => ({}),
	},
});

module.exports = {
	roomInfoRoomSchema,
	roomInfoPreferenceSchema,
};
