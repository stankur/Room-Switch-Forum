var Preference = require("./embeddedDocuments/Preference");

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var numberOfPeopleValidator = function (value) {
	return value === 1 || value === 2;
};

var quantityValidator = function (value) {
	return 1 <= value && value <= this.numberOfPeople;
};

var roomsLengthValidator = function (rooms) {
	return quantityValidator.bind(this)(rooms.length);
};

var OfferSchema = new Schema({
	numberOfPeople: {
		type: Number,
		validate: {
			validator: numberOfPeopleValidator,
		},
		default: 1,
	},
	roomsWanted: {
		type: Number,
		validate: {
			validator: quantityValidator,
		},
		default: 1,
	},
	rooms: {
		type: [
			{
				type: Schema.Types.ObjectId,
				ref: "Room",
			},
		],
		validate: {
			validator: roomsLengthValidator,
		},
		required: true,
	},

	preference: {
		type: [Preference],
		validate: function (arrayOfPreferences) {
			return arrayOfPreferences.length >= 1;
		},
		default: () => [{}],
	},
});

module.exports = mongoose.model("Offer", OfferSchema);
