var Offer = require("../../../models/Offer");

module.exports = () => {
	return Offer.find()
		.lean()
		.populate("user", "username")
		.sort({ dateCreated: 1, _id: 1 });
};
