var mongoose = require("mongoose");

const { expect } = require("chai");

var offerController = require("../offerController");

var residencesModule = require("../../staticInformation/residences");
var testOffers = require("./testOffers");

var mongoConfigTesting = require("../../mongoConfigTesting");

const request = require("supertest");
const express = require("express");
const e = require("express");
const { response } = require("express");
const Offer = require("../../models/Offer");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", offerController.getOffers);
app.get("/:id/matches", offerController.getMatches);

app.post("/", offerController.createOffer);

app.delete("/:id", offerController.deleteOffer);

var expectDataToEqual = (data, exepcted) => {
	expect(data.length).to.equal(exepcted.length);

	var ids = data.map((datum) => {
		return datum["_id"];
	});

	var expectedIds = exepcted.map((datum) => {
		return datum.id;
	});

	expect(ids).to.eql(expectedIds);
};

describe("offer controller test", () => {
	var testOffer1;
	var testOffer2;
	var testOffer3;
	var testOffer4;
	var testOffer5;
	var testOffer6;
	var testOffer7;
	var testOffer8;
	var testOffer9;

	var allOffers;
	before(async () => {
		await mongoConfigTesting.initializeMongoServer();

		testOffer1 = testOffers.testOffer1;
		testOffer2 = testOffers.testOffer2;
		testOffer3 = testOffers.testOffer3;
		testOffer4 = testOffers.testOffer4;
		testOffer5 = testOffers.testOffer5;
		testOffer6 = testOffers.testOffer6;
		testOffer7 = testOffers.testOffer7;
		testOffer8 = testOffers.testOffer8;
		testOffer9 = testOffers.testOffer9;

		allOffers = [
			testOffer1,
			testOffer2,
			testOffer3,
			testOffer4,
			testOffer5,
			testOffer6,
			testOffer7,
			testOffer8,
			testOffer9,
		];

		allOffers.forEach(async (testOffer) => {
			try {
				await testOffer.save();
			} catch (err) {
			} finally {
				return;
			}
		});
	});
	after(async () => {
		await setTimeout(mongoConfigTesting.endMongoConnection, 1000);
		console.log("connection closed");
	});

	describe("get offer test", () => {
		it("could get all offers", (done) => {
			request(app)
				.get("/")
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) {
						done(new Error(err));
					} else {
						var data = JSON.parse(response["text"]);
						expectDataToEqual(data, allOffers);
						done();
					}
				});
		});

		describe("filter test", () => {
			it("could perform one includes spec of filter", (done) => {
				request(app)
					.get("/")
					.query({
						filter: '{"rooms" : { "spec" : "Includes", "criteria": { "residenceArea" : ["Orchard Commons", "Exchange"]}}}',
					})
					.expect("Content-Type", /json/)
					.expect(200)
					.end((err, response) => {
						if (err) {
							done(new Error(err));
						} else {
							var data = JSON.parse(response["text"]);
							expectDataToEqual(data, [testOffer1, testOffer4]);
							done();
						}
					});
			});

			it("could perform one interval spec of filter", (done) => {
				request(app)
					.get("/")
					.query({
						filter: '{"numberOfPeople": { "spec": "Interval", "criteria" : [2, "Infinity"] }}',
					})
					.expect("Content-Type", /json/)
					.expect(200)
					.end((err, response) => {
						if (err) {
							done(new Error(err));
						} else {
							var data = JSON.parse(response["text"]);
							expectDataToEqual(data, [
								testOffer3,
								testOffer5,
								testOffer7,
								testOffer9,
							]);

							next();
						}
					});

				var next = () => {
					request(app)
						.get("/")
						.query({
							filter: '{"numberOfPeople" : { "spec": "Interval", "criteria" : [1, 1] }}',
						})
						.expect("Content-Type", /json/)
						.expect(200)
						.end((err, response) => {
							if (err) {
								done(new Error(err));
							} else {
								var data = JSON.parse(response["text"]);
								expectDataToEqual(data, [
									testOffer1,
									testOffer2,
									testOffer4,
									testOffer6,
									testOffer8,
								]);

								done();
							}
						});
				};
			});

			it("could perform normal spec of filter (the filter of acceptable values)", (done) => {
				request(app)
					.get("/")
					.query({
						filter: '{"roomsWanted" : 2}',
					})
					.expect("Content-Type", /json/)
					.expect(200)
					.end((err, response) => {
						if (err) {
							done(err);
						} else {
							var data = JSON.parse(response["text"]);
							expectDataToEqual(data, [testOffer3]);
							done();
						}
					});
			});

			it("could perform combined filters", (done) => {
				request(app)
					.get("/")
					.query({
						filter: '{ "numberOfPeople": 1, "rooms": {"spec": "Includes", "criteria": {"roomInfo": {"washroom": "Private", "floor": {"spec" : "Interval", "criteria" : [1, 5]}}}}}',
					})
					.expect("Content-Type", /json/)
					.expect(200)
					.end((err, response) => {
						if (err) {
							done(err);
						} else {
							var data = JSON.parse(response["text"]);
							expectDataToEqual(data, [
								testOffer2,
								testOffer6,
								testOffer8,
							]);
							done();
						}
					});
			});
		});

		describe("paginate test", () => {
			it("doesn't paginate when one of page or limit is not present in the query", (done) => {
				request(app)
					.get("/")
					.query({
						page: 1,
					})
					.expect("Content-Type", /json/)
					.expect(200)
					.end((err, response) => {
						if (err) {
							done(err);
						} else {
							var data = JSON.parse(response["text"]);

							expectDataToEqual(data, allOffers);
							next();
						}
					});

				var next = () => {
					request(app)
						.get("/")
						.query({
							page: 3,
						})
						.expect("Content-Type", /json/)
						.expect(200)
						.end((err, response) => {
							if (err) {
								done(err);
							} else {
								var data = JSON.parse(response["text"]);

								expectDataToEqual(data, allOffers);
								next1();
							}
						});
				};

				var next1 = () => {
					request(app)
						.get("/")
						.query({
							limit: 9,
						})
						.expect("Content-Type", /json/)
						.expect(200)
						.end((err, response) => {
							if (err) {
								done(err);
							} else {
								var data = JSON.parse(response["text"]);

								expectDataToEqual(data, allOffers);
								next2();
							}
						});
				};

				var next2 = () => {
					request(app)
						.get("/")
						.query({
							limit: 3,
						})
						.expect("Content-Type", /json/)
						.expect(200)
						.end((err, response) => {
							if (err) {
								done(err);
							} else {
								var data = JSON.parse(response["text"]);

								expectDataToEqual(data, allOffers);
								done();
							}
						});
				};
			});

			it("paginates properly when both page and limit are present in the query", (done) => {
				request(app)
					.get("/")
					.query({
						limit: 5,
						page: 1,
					})
					.expect("Content-Type", /json/)
					.expect(200)
					.end((err, response) => {
						if (err) {
							done(err);
						} else {
							var data = JSON.parse(response["text"]);

							expectDataToEqual(data, [
								testOffer1,
								testOffer2,
								testOffer3,
								testOffer4,
								testOffer5,
							]);
							next();
						}
					});

				var next = () => {
					request(app)
						.get("/")
						.query({
							limit: 3,
							page: 3,
						})
						.expect("Content-Type", /json/)
						.expect(200)
						.end((err, response) => {
							if (err) {
								done(err);
							} else {
								var data = JSON.parse(response["text"]);

								expectDataToEqual(data, [
									testOffer7,
									testOffer8,
									testOffer9,
								]);
								next1();
							}
						});
				};

				var next1 = () => {
					request(app)
						.get("/")
						.query({
							limit: 3,
							page: 3,
						})
						.expect("Content-Type", /json/)
						.expect(200)
						.end((err, response) => {
							if (err) {
								done(err);
							} else {
								var data = JSON.parse(response["text"]);

								expectDataToEqual(data, [
									testOffer7,
									testOffer8,
									testOffer9,
								]);
								next2();
							}
						});
				};

				var next2 = () => {
					request(app)
						.get("/")
						.query({
							limit: 3,
							page: 4,
						})
						.expect("Content-Type", /json/)
						.expect(200)
						.end((err, response) => {
							if (err) {
								done(err);
							} else {
								var data = JSON.parse(response["text"]);

								expect(Object.keys(data).length).to.equal(0);

								done();
							}
						});
				};
			});
		});
	});

	describe("get matches test", () => {
		it("could get all offers of default preference", (done) => {
			request(app)
				.get("/" + testOffer1.id + "/matches")
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) {
						done(err);
					} else {
						var data = JSON.parse(response["text"]);

						expectDataToEqual(data, [
							testOffer2,
							testOffer3,
							testOffer4,
							testOffer5,
							testOffer6,
							testOffer7,
							testOffer8,
							testOffer9,
						]);
						done();
					}
				});
		});

		it("could get offers matching custom preference", (done) => {
			request(app)
				.get("/" + testOffer3.id + "/matches")
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) {
						done(err);
					} else {
						var data = JSON.parse(response["text"]);
						expectDataToEqual(data, [testOffer5]);
						done();
					}
				});
		});
	});

	describe("create offer test", () => {
		var isDate = (dateString) => {
			return (
				new Date(dateString) !== "Invalid Date" &&
				!isNaN(new Date(dateString))
			);
		};

		var testHasValidDefaultFields = (data) => {
			expect(isDate(data["dateCreated"])).to.be.true;

			data["rooms"].forEach((room) => {
				var residenceArea = room["residenceArea"];
				var residenceType = room["generalInfo"]["residenceType"];
				var miminumAge = room["eligibilityInfo"]["minimumAge"];

				expect(residenceType).to.equal(
					residencesModule.getTypeOf(residenceArea)
				);

				expect(miminumAge).to.equal(
					residencesModule.getMinimumAgeOf(residenceArea)
				);
			});
		};

		it("could create a new offer when offer json's rooms' room do not have fields 'dateCreated', 'residenceType', nor 'minimumAge'", (done) => {
			request(app)
				.post("/")
				.send({
					offer: {
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
									floor: 10,
									washroom: "Private",
									building: "Bartlett House",
								},
								eligibilityInfo: {
									allowedGender: "Any",
								},
							},
						],
					},
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) {
						done(err);
					} else {
						var data = JSON.parse(response["text"]);

						testHasValidDefaultFields(data);
						done();
					}
				});
		});

		it("could remove dateCreated field", (done) => {
			request(app)
				.post("/")
				.send({
					offer: {
						numberOfPeople: 1,
						roomsWanted: 1,
						dateCreated: "now lmao",
						rooms: [
							{
								residenceArea: "Orchard Commons",
								generalInfo: {
									session: "Winter Session",
								},
								roomInfo: {
									room: "Connected Single Room",
									floor: 10,
									washroom: "Private",
									building: "Bartlett House",
								},
								eligibilityInfo: {
									allowedGender: "Any",
								},
							},
						],
					},
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) {
						done(err);
					} else {
						var data = JSON.parse(response["text"]);

						testHasValidDefaultFields(data);
						done();
					}
				});
		});

		it("could remove residenceType field", (done) => {
			request(app)
				.post("/")
				.send({
					offer: {
						numberOfPeople: 1,
						roomsWanted: 1,
						rooms: [
							{
								residenceArea: "Orchard Commons",
								generalInfo: {
									residenceType: "lol jrijirjgirjg",
									session: "Winter Session",
								},
								roomInfo: {
									room: "Connected Single Room",
									floor: 10,
									washroom: "Private",
									building: "Bartlett House",
								},
								eligibilityInfo: {
									allowedGender: "Any",
								},
							},
						],
					},
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) {
						done(err);
					} else {
						var data = JSON.parse(response["text"]);

						testHasValidDefaultFields(data);

						done();
					}
				});
		});

		it("could remove invalid minimumAge", (done) => {
			request(app)
				.post("/")
				.send({
					offer: {
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
									floor: 10,
									washroom: "Private",
									building: "Bartlett House",
								},
								eligibilityInfo: {
									allowedGender: "Any",
									minimumAge: "yey",
								},
							},
						],
					},
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) {
						done(err);
					} else {
						var data = JSON.parse(response["text"]);

						testHasValidDefaultFields(data);

						done();
					}
				});
		});
	});

	describe("delete offer test", () => {
		it("could delete offer when given id is present", (done) => {
			request(app)
				.delete("/" + testOffer1.id)
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err) => {
					if (err) {
						return done(err);
					}

					Offer.findById(testOffer1.id, (err, foundOffer) => {
						if (err) {
							return done(err);
						} else {
							expect(foundOffer).to.be.not.ok;
							done();
						}
					});
				});
		});

		it("works when given id does not exist", (done) => {
			request(app)
				.delete("/" + new mongoose.Types.ObjectId())
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err) => {
					expect(err).to.be.ok;
					done();
				});
		});
	});
});
