const { expect } = require("chai");
var accomodationValidator = require("../accomodationValidator");

describe("accomodation validator test", () => {
	it("validates session correctlye", () => {
		expect(
			accomodationValidator(
				"sessions",
				"Orchard Commons"
			)("Winter Session")
		).to.be.true;
		expect(
			accomodationValidator(
				"sessions",
				"Orchard Commons"
			)("Summer Session")
		).to.be.false;

		expect(accomodationValidator("sessions", "Acadia Park")("Year Round"))
			.to.be.true;
		expect(
			accomodationValidator("sessions", "Acadia Park")("Winter Session")
		).to.be.false;
	});

	it("validates room correctly", () => {
		expect(
			accomodationValidator("rooms", "Ponderosa Commons")("Studio Suite")
		).to.be.true;
		expect(
			accomodationValidator(
				"rooms",
				"Ponderosa Commons"
			)("Two Bedroom Suite")
		).to.be.true;
		expect(
			accomodationValidator(
				"rooms",
				"Ponderosa Commons"
			)("Single Traditional Room")
		).to.be.false;
	});

	it("validates building correctly", () => {
		expect(
			accomodationValidator(
				"buildings",
				"Place Vanier"
			)("Korea-UBC House")
		).to.be.true;
		expect(
			accomodationValidator("buildings", "Place Vanier")("Nootka House")
		).to.be.false;
	});

	it("throws error when property given in invalid", () => {
		expect(() => {
			accomodationValidator(
				"building",
				"Place vanier"
			)("Korea-UBC House");
		}).to.throw("building: property invalid");
	});
});
