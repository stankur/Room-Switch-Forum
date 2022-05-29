const { expect } = require("chai");
var floorValidator = require("../floorValidator").floorValidator;

describe("floor validator test", () => {
	it("rejects nonpositive numbers", () => {
		expect(floorValidator(0)).to.be.false;
		expect(floorValidator(-1)).to.be.false;
		expect(floorValidator(-2)).to.be.false;
		expect(floorValidator(-20)).to.be.false;

		expect(floorValidator(-0.5)).to.be.false;
		expect(floorValidator(-0.01)).to.be.false;
		expect(floorValidator(-10.01)).to.be.false;
	});

	it("rejects positive non integers", () => {
		expect(floorValidator(0.5)).to.be.false;
		expect(floorValidator(2.3)).to.be.false;
	});

	it("accepts positive integers", () => {
		expect(floorValidator(1)).to.be.true;
		expect(floorValidator(5)).to.be.true;
		expect(floorValidator(15)).to.be.true;
	});

	it("rejects array of length not 2", () => {
		expect(floorValidator([1])).to.be.false;
		expect(floorValidator([3])).to.be.false;
		expect(floorValidator([1, 2, 3])).to.be.false;
	});

	it("rejects non integer array", () => {
		expect(floorValidator([1.2, 3])).to.be.false;
		expect(floorValidator([1, 3.2])).to.be.false;
		expect(floorValidator([1.5, 3.2])).to.be.false;
	});

	it("rejects non increasing array", () => {
		expect(floorValidator([3, 2])).to.be.false;
		expect(floorValidator([5, 3])).to.be.false;
	});

	it("accepts valid array", () => {
		expect(floorValidator([0, 3])).to.be.false;
		expect(floorValidator([1, 3])).to.be.true;
		expect(floorValidator([2, "Infinity"])).to.be.true;
	});
});
