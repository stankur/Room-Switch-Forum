var residenceTypes = require("../residenceTypes");
var sessionTypes = require("../sessionTypes");
var roomTypes = require("../roomTypes");
var minimumAges = require("../minimumAges");

var createResidence = (name, type, sessions, rooms, buildings, minimumAge) => {
	if (!residenceTypes.includes(type)) {
		throw new Error(type + ": residence type invalid");
	}

	sessions.forEach((session) => {
		if (!sessionTypes.includes(session)) {
			throw new Error(session + ": session type invalid");
		}
	});

	rooms.forEach((room) => {
		if (!roomTypes.includes(room)) {
			throw new Error(room + ": room type invalid");
		}
	});

	if (minimumAge === undefined) {
		minimumAge = 0;
	}

	if (!minimumAges.includes(minimumAge)) {
		throw new Error(minimumAge + ": minimum age invalid");
	}
	return { name, type, sessions, rooms, buildings, minimumAge };
};

module.exports = createResidence;
