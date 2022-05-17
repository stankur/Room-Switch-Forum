var addFilters = require("./addFilters");

var queryChecker = (urlQuery, documentsSearch) => {
	var applyFilter = () => {
		if (urlQuery && urlQuery.filter) {
			var filterJSON = JSON.parse(urlQuery.filter);

			var filteredDocumentsSearch = addFilters(
				documentsSearch,
				[],
				filterJSON
			);
			return queryChecker(urlQuery, filteredDocumentsSearch);
		}

		return queryChecker(urlQuery, documentsSearch);
	};

	var applyPagination = () => {
		if (urlQuery && urlQuery.page && urlQuery.limit) {
			var pageNumber = urlQuery.page;
			var limitPerpage = urlQuery.limit;

			if (pageNumber > 0 && limitPerpage > 0) {
				var paginatedDocumentsSearch = documentsSearch
					.skip((pageNumber - 1) * limitPerpage)
					.limit(limitPerpage);
				return queryChecker(urlQuery, paginatedDocumentsSearch);
			}
		}

		return queryChecker(urlQuery, documentsSearch);
	};

	var modifiedDocumentsSearch = documentsSearch;
	return { applyFilter, applyPagination, modifiedDocumentsSearch };
};

module.exports = queryChecker;
