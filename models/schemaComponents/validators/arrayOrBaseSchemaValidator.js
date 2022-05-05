var noDuplicateAndNotEmptyValidator = function (array) {
	var noDuplicate = new Set(array).length === array.length;
	var notEmpty = array.length >= 1;

	return noDuplicate && notEmpty;
};

var isSubsetOfCollection = function (subset, collection) {
	return subset.every((element) => {
		return collection.includes(element);
	});
};

module.exports = {
	noDuplicateAndNotEmptyValidator,
	isSubsetOfCollection,
};
