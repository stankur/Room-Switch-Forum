var Offer = require("../models/Offer");

var getOffer = (req, res, next) => {
	var sendResult = (err, result) => {
		if (err) {
			return next(err);
		}

		return res.json(result);
	};

	if (req.query) {
		if (req.query.page && req.query.limit) {
			var pageNumber = req.query.page;
			var limitPerpage = req.query.limit;

			if (pageNumber > 0 && limitPerpage > 0) {
				Offer.find()
					.sort({ dateCreated: 1 })
					.skip((pageNumber - 1) * limitPerpage)
					.limit(limitPerpage)
					.exec(sendResult);
			}
		}
	}

	Offer.find().sort({ dateCreated: 1 }).exec(sendResult);
};

module.exports = { getOffer };
