var Offer = require("../../models/Offer");

var addFilters = require("./helpers/addFilters");
var createInitialSearch = require("./helpers/createInitialSeacrh");
var queryChecker = require("./helpers/queryChecker");

var getOffers = (req, res, next) => {
	var sendResult = (err, result) => {
		if (err) {
			return next(err);
		}

		return res.json(result);
	};

	var documentsSearch = queryChecker(req.query, createInitialSearch())
		.applyFilter()
		.applyPagination().modifiedDocumentsSearch;

	return documentsSearch.exec(sendResult);
};

var findOffer = (req, res, next) => {
	var offerId = req.params.id;

	Offer.findById(offerId)
		.lean()
		.populate("user", "username")
		.exec((err, offer) => {
			if (err) {
				return next(err);
			}

			console.log(JSON.stringify(offer));
			if (!offer) {
				return next(new Error("no offer found"));
			}

			req.offer = offer;
			return next();
		});
};

var sendOffer = (req, res, next) => {
	res.json(req.offer);
};

var getOffer = [findOffer, sendOffer];

var sendMatches = (req, res, next) => {
	var offer = req.offer;

	var preference = offer["preference"];

	var filters = preference.map((roomFilter) => {
		return {
			rooms: {
				spec: "Includes",
				criteria: roomFilter,
			},
		};
	});

	var documentsSearch = Offer.find({
		$and: [
			{
				$or: filters.map((filter) => {
					return addFilters(
						createInitialSearch(),
						[],
						filter
					).getFilter();
				}),
			},

			{
				_id: { $ne: offer["_id"] },
			},
		],
	})
		.lean()
		.populate("user", "username")
		.sort({ dateCreated: 1 });

	documentsSearch = queryChecker(req.query, documentsSearch)
		.applyFilter()
		.applyPagination().modifiedDocumentsSearch;

	var sendResult = (err, offers) => {
		if (err) {
			return next(err);
		}

		return res.json(offers);
	};

	return documentsSearch.exec(sendResult);
};

var getMatches = [findOffer, sendMatches];

var createOffer = (req, res, next) => {
	var offer = req.body.offer;

	if (!offer) {
		return next(
			new Error("offer is not attached in the body of the request.")
		);
	}

	if (!(offer instanceof Object)) {
		return next(new Error("offer must be of type object."));
	}

	var remove = (object, key) => {
		var modified = {};

		Object.keys(object).forEach((objKey) => {
			if (objKey === key) {
				return;
			}
			modified = { ...modified, [objKey]: object[objKey] };
			return;
		});

		return modified;
	};

	offer = remove(offer, "dateCreated");

	try {
		offer["rooms"] = offer["rooms"].map((room) => {
			try {
				room["generalInfo"] = remove(
					room["generalInfo"],
					"residenceType"
				);
			} catch (err) {}

			return room;
		});
	} catch (err) {}

	try {
		offer["rooms"] = offer["rooms"].map((room) => {
			try {
				room["eligibilityInfo"] = remove(
					room["eligibilityInfo"],
					"minimumAge"
				);
			} catch (err) {}

			return room;
		});
	} catch (err) {}

	var newOffer = new Offer(offer);

	newOffer.save((err, newOffer) => {
		if (err) {
			return next(err);
		}

		return res.json(newOffer.toObject());
	});
};

var deleteOffer = (req, res, next) => {
	var offerId = req.params.id;

	Offer.findByIdAndDelete(offerId, (err, foundOffer) => {
		if (err) {
			return next(err);
		}

		if (!foundOffer) {
			return next(new Error("no offer with given id found"));
		}

		res.json(foundOffer);
	});
};

module.exports = { getOffers, getOffer, getMatches, createOffer, deleteOffer };
