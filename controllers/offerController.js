var Offer = require("../models/Offer");

var addFilters = (documentsSearch, traversedLayers, JSONElement) => {
	console.log("traversedLayers recieved: " + traversedLayers.toString());
	var path = traversedLayers.join(".");
	if (!Object.keys(JSONElement)) {
		return documentsSearch;
	}
	if (Object.keys(JSONElement).includes("type")) {
		if (JSONElement["type"] === "Includes") {
			var included = JSONElement["criteria"];

			return documentsSearch.where(path).elemMatch((elem) => {
				for (const [key, value] of Object.entries(included)) {
					addFilters(elem, [key], value);
				}
			});
		}
		if (JSONElement["type"] === "Interval") {
			var interval = JSONElement["criteria"];
			console.log("interval: " + interval);

			interval = interval.map((num) => {
				if (num === "Infinity") {
					return Infinity;
				}
				return num;
			});

			var smallerNumber = interval[0];
			console.log("smaller: " + smallerNumber);
			var biggerNumber = interval[1];
			console.log("bigger: " + biggerNumber);

			var now = documentsSearch
				.where(path)
				.lte(biggerNumber)
				.gte(smallerNumber);

			console.log(now);
			return now;
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
		documentsSearch = addFilters(
			documentsSearch,
			[...traversedLayers, key],
			JSONElement[key]
		);
	});

	console.log("doc search:" + documentsSearch);
	return documentsSearch;
};

var getOffer = (req, res, next) => {
	var sendResult = (err, result) => {
		if (err) {
			return next(err);
		}

		return res.json(result);
	};

	var documentsSearch = Offer.find().lean().sort({ dateCreated: 1 });

	if (req.query) {
		if (req.query.filter) {
			console.log(req.query.filter);
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

module.exports = { getOffer };
