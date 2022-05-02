const { expect } = require("chai");

var Room = require("../Room");

describe("room test", () => {
	it("invalidates missing required fields", (done) => {
		var testRoom = new Room({
			residenceArea: "Orchard Commons",
		});

		testRoom.validate((err) => {
			expect(err.errors["generalInfo.residenceType"]).to.not.exist;
			expect(err.errors["generalInfo.session"]).to.exist;

			expect(err.errors["roomInfo.room"]).to.exist;
			expect(err.errors["roomInfo.floor"]).to.exist;
			expect(err.errors["roomInfo.washroom"]).to.exist;
			expect(err.errors["roomInfo.building"]).to.exist;

			expect(err.errors["eligibilityInfo.minimumAge"]).to.not.exist;
			expect(err.errors["eligibilityInfo.allowedGender"]).to.exist;

			done();
		});
	});
});
