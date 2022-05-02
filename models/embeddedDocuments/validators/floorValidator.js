var isPositiveInteger = function (value) {
	return Number.isInteger(value) && value > 0;
};

var isArrayOfLengthTwo = function (value) {
	return Array.isArray(value) && value.length === 2;
};

var isIncreasing = function (value) {
	var first = value[0];
	var second = value[1];

	return (
		isPositiveInteger(first) &&
		(isPositiveInteger(second) || second === Infinity) &&
		second > first
	);
};

var floorValidator = function (value) {
	return (
		isPositiveInteger(value) ||
		(isArrayOfLengthTwo(value) && isIncreasing(value))
	);
};

module.exports = floorValidator;
