var residencesModule = require("../staticInformation/residences");
var Room = require("./Room");
var Preference = require("./embeddedDocuments/Preference");

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var quantityValidator = function (value) {
	return 1 <= value && value <= this.numberOfPeople;
};

var OfferSchema = new Schema({
	numberOfPeople: {
		type: Number,
		validate: {
			validator: function (value) {
				return value === 1 || value === 2;
			},
		},
		required: true,
	},
	roomsWanted: {
		type: Number,
		validate: {
			validator: quantityValidator,
		},
		default: 1,
	},
	rooms: [
		{
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "Room",
				},
			],
			validate: {
				validator: function (arrayOfRooms) {
					return quantityValidator(arrayOfRooms.length);
				},
			},
			required: true,
		},
	],
	preference: {
		type: [Preference],
		validate: function (arrayOfPreferences) {
			return arrayOfPreferences >= 0;
		},
		default: [{}],
	},
});

module.exports = mongoose.model("Offer", OfferSchema);
