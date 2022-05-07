const { expect } = require("chai");
var mongoose = require("mongoose");

var Room = mongoose.model("Room", require("../Room"));

describe("room test", () => {
	it("invalidates missing required fields", (done) => {
		var testRoom = new Room({
			residenceArea: "Orchard Commons",
		});

		testRoom.validate((err) => {
			expect(err.errors["generalInfo"]).to.exist;
			expect(err.errors["roomInfo"]).to.exist;
			expect(err.errors["eligibilityInfo"]).to.exist;

			done();
		});
	});

	it("throws no error for all valid fields", (done) => {
		var testRoom = new Room({
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
		});

		testRoom.validate((err) => {
			expect(err).to.be.null;
			done();
		});
	});

	it("works when residence type is given and correct", (done) => {
		var testRoom = new Room({
			residenceArea: "Orchard Commons",
			generalInfo: {
				residenceType: "First Year",
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
		});

		testRoom.validate((err) => {
			expect(err).to.be.null;
			done();
		});
	});

	it("throws error on wrong residence type", (done) => {
		var testRoom = new Room({
			residenceArea: "Orchard Commons",
			generalInfo: {
				residenceType: "Upper Year",
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
		});

		testRoom.validate((err) => {
			expect(err.errors["generalInfo.residenceType"]).to.exist;
			done();
		});
	});

	it("works on correct residence type", (done) => {
		var testRoom = new Room({
			residenceArea: "Orchard Commons",
			generalInfo: {
				residenceType: "First Year",
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
		});

		testRoom.validate((err) => {
			expect(err).to.be.null;
			done();
		});
	});

	it("throws error on wrong minimum age", (done) => {
		var testRoom = new Room({
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
				minimumAge: 18,
			},
		});

		testRoom.validate((err) => {
			expect(err.errors["eligibilityInfo.minimumAge"]).to.exist;
			done();
		});
	});

	it("works on correct minimum age", (done) => {
		var testRoom = new Room({
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
				minimumAge: 0,
			},
		});

		testRoom.validate((err) => {
			expect(err).to.be.null;
			done();
		});
	});
});
