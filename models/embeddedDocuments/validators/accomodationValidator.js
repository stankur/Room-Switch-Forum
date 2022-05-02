var residencesModule = require("../../../staticInformation/residences");

var getPropertyGetter = function (property) {
	if (property === "sessions") {
		return residencesModule.getSessionsOf;
	} else if (property === "rooms") {
		return residencesModule.getRoomsOf;
	} else if (property === "buildings") {
		return residencesModule.getBuildingsOf;
	} else {
		throw new Error(property + ": property invalid");
	}
};

var accomodationValidator = function (property, residenceName) {
	var allPossibilities = getPropertyGetter(property)(residenceName);

	return function (value) {
		return allPossibilities.includes(value);
	};
};

module.exports = accomodationValidator;
