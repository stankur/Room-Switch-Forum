const { expect } = require("chai");

var Offer = require("../Offer");
var mongoose = require("mongoose");

describe("Offer test", () => {
	it("invalidates document with missing field", (done) => {
		var testOffer = new Offer({});

		testOffer.validate((err) => {
			expect(err.errors["rooms"]).to.exist;
			expect(err.errors["numberOfPeople"]).to.not.exist;
			expect(err.errors["roomsWanted"]).to.not.exist;
			expect(err.errors["preference"]).to.not.exist;

			done();
		});
	});

	it("could invalidate unacceptable number of people", (done) => {
		var testOffer = new Offer({
			numberOfPeople: 3,
			rooms: [
				new mongoose.Types.ObjectId(),
				new mongoose.Types.ObjectId(),
			],
		});

		testOffer.validate((err) => {
			expect(err.errors["numberOfPeople"]).to.exist;
			expect(err.errors["rooms"]).to.not.exist;
			expect(err.errors["roomsWanted"]).to.not.exist;
			expect(err.errors["preference"]).to.not.exist;

			done();
		});
	});

	it("could invalidate and validate unacceptable number of rooms wanted", (done) => {
		var testOffer = new Offer({
			numberOfPeople: 1,
			roomsWanted: 2,
			rooms: [new mongoose.Types.ObjectId()],
		});

		testOffer.validate((err) => {
			expect(err.errors["numberOfPeople"]).to.not.exist;
			expect(err.errors["rooms"]).to.not.exist;
			expect(err.errors["roomsWanted"]).to.exist;
			expect(err.errors["preference"]).to.not.exist;

			next1();
		});

		var next1 = function () {
			testOffer = new Offer({
				numberOfPeople: 1,
				roomsWanted: 1,
				rooms: [new mongoose.Types.ObjectId()],
			});

			testOffer.validate((err) => {
				expect(err.errors["numberOfPeople"]).to.not.exist;
				expect(err.errors["rooms"]).to.not.exist;
				expect(err.errors["roomsWanted"]).to.not.exist;
				expect(err.errors["preference"]).to.not.exist;

				next2();
			});
		};

		var next2 = function () {
			testOffer = new Offer({
				numberOfPeople: 2,
				roomsWanted: 1,
				rooms: [new mongoose.Types.ObjectId()],
			});

			testOffer.validate((err) => {
				expect(err.errors["numberOfPeople"]).to.not.exist;
				expect(err.errors["rooms"]).to.not.exist;
				expect(err.errors["roomsWanted"]).to.not.exist;
				expect(err.errors["preference"]).to.not.exist;

				next3();
			});
		};

		var next3 = function () {
			testOffer = new Offer({
				numberOfPeople: 2,
				roomsWanted: 2,
				rooms: [new mongoose.Types.ObjectId()],
			});

			testOffer.validate((err) => {
				expect(err.errors["numberOfPeople"]).to.not.exist;
				expect(err.errors["rooms"]).to.not.exist;
				expect(err.errors["roomsWanted"]).to.not.exist;
				expect(err.errors["preference"]).to.not.exist;

				next4();
			});
		};

		var next4 = function () {
			testOffer = new Offer({
				numberOfPeople: 2,
				roomsWanted: 3,
				rooms: [new mongoose.Types.ObjectId()],
			});

			testOffer.validate((err) => {
				expect(err.errors["numberOfPeople"]).to.not.exist;
				expect(err.errors["rooms"]).to.not.exist;
				expect(err.errors["roomsWanted"]).to.exist;
				expect(err.errors["preference"]).to.not.exist;

				done();
			});
		};
	});
});
