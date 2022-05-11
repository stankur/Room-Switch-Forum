const { expect } = require("chai");

var Offer = require("../Offer");
var mongoose = require("mongoose");

var errorExist = (startWord, errors, isExact) => {
	if (!errors) {
		return false;
	}
	return Object.keys(errors).some((errorKey) => {
		if (isExact) {
			return Boolean(
				new RegExp(
					"(^" + startWord + "$)|(^" + startWord + "\\.)"
				).exec(errorKey)
			);
		}
		return Boolean(new RegExp("^" + startWord).exec(errorKey));
	});
};

describe("Offer test", () => {
	it("invalidates document with missing field", (done) => {
		var testOffer = new Offer({});

		testOffer.validate((err) => {
			expect(errorExist("rooms", err.errors, true)).to.be.true;
			expect(errorExist("numberOfPeople", err.errors)).to.be.false;
			expect(errorExist("roomsWanted", err.errors)).to.be.false;
			expect(errorExist("preference", err.errors)).to.be.false;
			expect(errorExist("dateCreated", err.errors)).to.be.false;

			done();
		});
	});

	it("could invalidate unacceptable number of people", (done) => {
		var testOffer = new Offer({
			numberOfPeople: 3,
			rooms: [
				{
					residenceArea: "Orchard Commons",
					generalInfo: {
						session: "Winter Session",
					},
					roomInfo: {
						room: "Connected Single Room",
						floor: 14,
						washroom: "Private",
						building: "Braeburn House",
					},
					eligibilityInfo: {
						allowedGender: "Male",
					},
				},
				{
					residenceArea: "Orchard Commons",
					generalInfo: {
						session: "Winter Session",
					},
					roomInfo: {
						room: "Connected Single Room",
						floor: 15,
						washroom: "Private",
						building: "Braeburn House",
					},
					eligibilityInfo: {
						allowedGender: "Male",
					},
				},
			],
		});

		testOffer.validate((err) => {
			expect(errorExist("numberOfPeople", err.errors)).to.be.true;
			expect(errorExist("rooms", err.errors, true)).to.be.false;
			expect(errorExist("roomsWanted", err.errors)).to.be.false;
			expect(errorExist("preference", err.errors)).to.be.false;
			expect(errorExist("dateCreated", err.errors)).to.be.false;

			done();
		});
	});

	it("could invalidate and validate unacceptable number of rooms wanted", (done) => {
		var testOffer = new Offer({
			numberOfPeople: 1,
			roomsWanted: 2,
			rooms: [
				{
					residenceArea: "Orchard Commons",
					generalInfo: {
						session: "Winter Session",
					},
					roomInfo: {
						room: "Connected Single Room",
						floor: 14,
						washroom: "Private",
						building: "Braeburn House",
					},
					eligibilityInfo: {
						allowedGender: "Male",
					},
				},
			],
		});

		testOffer.validate((err) => {
			expect(errorExist("numberOfPeople", err.errors)).to.be.false;
			expect(errorExist("rooms", err.errors, true)).to.be.false;
			expect(errorExist("roomsWanted", err.errors)).to.be.true;
			expect(errorExist("preference", err.errors)).to.be.false;
			expect(errorExist("dateCreated", err.errors)).to.be.false;
			next1();
		});

		var next1 = function () {
			testOffer = new Offer({
				numberOfPeople: 1,
				roomsWanted: 1,
				rooms: [
					{
						residenceArea: "Orchard Commons",
						generalInfo: {
							session: "Winter Session",
						},
						roomInfo: {
							room: "Connected Single Room",
							floor: 14,
							washroom: "Private",
							building: "Braeburn House",
						},
						eligibilityInfo: {
							allowedGender: "Male",
						},
					},
				],
			});

			testOffer.validate((err) => {
				expect(err).to.not.be.ok;

				next2();
			});
		};

		var next2 = function () {
			testOffer = new Offer({
				numberOfPeople: 2,
				roomsWanted: 1,
				rooms: [
					{
						residenceArea: "Orchard Commons",
						generalInfo: {
							session: "Winter Session",
						},
						roomInfo: {
							room: "Connected Single Room",
							floor: 14,
							washroom: "Private",
							building: "Braeburn House",
						},
						eligibilityInfo: {
							allowedGender: "Male",
						},
					},
				],
			});

			testOffer.validate((err) => {
				expect(err).to.not.be.ok;

				next3();
			});
		};

		var next3 = function () {
			testOffer = new Offer({
				numberOfPeople: 2,
				roomsWanted: 2,
				rooms: [
					{
						residenceArea: "Orchard Commons",
						generalInfo: {
							session: "Winter Session",
						},
						roomInfo: {
							room: "Connected Single Room",
							floor: 14,
							washroom: "Private",
							building: "Braeburn House",
						},
						eligibilityInfo: {
							allowedGender: "Male",
						},
					},
				],
			});

			testOffer.validate((err) => {
				expect(err).to.not.be.ok;

				next4();
			});
		};

		var next4 = function () {
			testOffer = new Offer({
				numberOfPeople: 2,
				roomsWanted: 3,
				rooms: [
					{
						residenceArea: "Orchard Commons",
						generalInfo: {
							session: "Winter Session",
						},
						roomInfo: {
							room: "Connected Single Room",
							floor: 14,
							washroom: "Private",
							building: "Braeburn House",
						},
						eligibilityInfo: {
							allowedGender: "Male",
						},
					},
				],
			});

			testOffer.validate((err) => {
				expect(errorExist("numberOfPeople", err.errors)).to.be.false;
				expect(errorExist("rooms", err.errors, true)).to.be.false;
				expect(errorExist("roomsWanted", err.errors)).to.be.true;
				expect(errorExist("preference", err.errors)).to.be.false;
				expect(errorExist("dateCreated", err.errors)).to.be.false;

				done();
			});
		};
	});

	it("accepts valid preference", (done) => {
		var testOffer = new Offer({
			numberOfPeople: 2,
			roomsWanted: 2,
			rooms: [
				{
					residenceArea: "Orchard Commons",
					generalInfo: {
						session: "Winter Session",
					},
					roomInfo: {
						room: "Connected Single Room",
						floor: 14,
						washroom: "Private",
						building: "Braeburn House",
					},
					eligibilityInfo: {
						allowedGender: "Male",
					},
				},
			],
			preference: [
				{
					residenceArea: ["Orchard Commons"],
					generalInfo: {
						floor: {
							spec: "Interval",
							criteria: [1, 10],
						},
					},
				},
			],
		});

		testOffer.validate((err) => {
			expect(err).to.not.be.ok;
			done();
		});
	});
});
