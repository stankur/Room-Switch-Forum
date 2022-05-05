var isPositiveInteger = function (value) {
	return Number.isInteger(value) && value > 0;
};

var isArrayOfLengthTwo = function (value) {
	return Array.isArray(value) && value.length === 2;
};

var isNonDecreasing = function (value) {
	var first = value[0];
	var second = value[1];

	return (
		isPositiveInteger(first) &&
		(isPositiveInteger(second) || second === Infinity) &&
		second >= first
	);
};

var isValidPositiveRange = function (value) {
	return isArrayOfLengthTwo(value) && isNonDecreasing(value);
};

var floorValidator = function (value) {
	return isPositiveInteger(value) || isValidPositiveRange(value);
};

module.exports = { floorValidator, isValidPositiveRange, isPositiveInteger };
