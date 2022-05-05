const { expect } = require("chai");

var Room = require("../Room");

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
			console.log(err);

			expect(err).to.be.null;
			done();
		});
	});
});
