const { default: mongoose } = require("mongoose");
var Offer = require("../models/Offer");

var addFilters = (documentsSearch, traversedLayers, JSONElement) => {
	var path = traversedLayers.join(".");

	if (!Object.keys(JSONElement)) {
		return documentsSearch;
	}
	if (Object.keys(JSONElement).includes("spec")) {
		if (JSONElement["spec"] === "Includes") {
			var included = JSONElement["criteria"];

			return documentsSearch.where(path).elemMatch((elem) => {
				for (const [key, value] of Object.entries(included)) {
					addFilters(elem, [key], value);
				}
			});
		}
		if (JSONElement["spec"] === "Interval") {
			var interval = JSONElement["criteria"];

			interval = interval.map((num) => {
				if (num === "Infinity") {
					return Number.MAX_SAFE_INTEGER;
				}
				return num;
			});

			var smallerNumber = interval[0];
			var biggerNumber = interval[1];

			return documentsSearch
				.where(path)
				.lte(biggerNumber)
				.gte(smallerNumber);
		}
	}

	if (JSONElement instanceof Array) {
		var preferences = JSONElement;
		return documentsSearch.where(path).in(preferences);
	}

	if (!(JSONElement instanceof Object)) {
		return documentsSearch.where({ [path]: JSONElement });
	}

	Object.keys(JSONElement).forEach((key) => {
		if (key === "_id") {
			// don't do anything because "_id" is not a field for filtering
		} else {
			documentsSearch = addFilters(
				documentsSearch,
				[...traversedLayers, key],
				JSONElement[key]
			);
		}
	});

	return documentsSearch;
};

var createInitialSearch = () => {
	return Offer.find().lean().sort({ dateCreated: 1 });
};

var getOffers = (req, res, next) => {
	var sendResult = (err, result) => {
		if (err) {
			return next(err);
		}

		return res.json(result);
	};

	var documentsSearch = createInitialSearch();

	if (req.query) {
		if (req.query.filter) {
			var filterJSON = JSON.parse(req.query.filter);
			documentsSearch = addFilters(documentsSearch, [], filterJSON);
		}

		if (req.query.page && req.query.limit) {
			var pageNumber = req.query.page;
			var limitPerpage = req.query.limit;

			if (pageNumber > 0 && limitPerpage > 0) {
				documentsSearch = documentsSearch
					.skip((pageNumber - 1) * limitPerpage)
					.limit(limitPerpage);
			}
		}
	}

	return documentsSearch.exec(sendResult);
};

var findOffer = (req, res, next) => {
	var offerId = req.params.id;

	Offer.findById(offerId)
		.lean()
		.exec((err, offer) => {
			if (err) {
				return next(err);
			}

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

	var query = Offer.find({
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
		.sort({ dateCreated: 1 });

	query.exec((err, offers) => {
		if (err) {
			return next(err);
		}

		res.json(offers);
	});
};

var getMatches = [findOffer, sendMatches];

module.exports = { getOffers, getOffer, getMatches };
