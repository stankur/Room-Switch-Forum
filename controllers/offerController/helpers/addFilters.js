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

module.exports = addFilters;
