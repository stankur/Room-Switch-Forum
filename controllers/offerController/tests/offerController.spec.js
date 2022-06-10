var mongoose = require("mongoose");

const { expect } = require("chai");

var offerController = require("../offerController");

var residencesModule = require("../../../staticInformation/residences");
var testOffers = require("./testOffers");

var mongoConfigTesting = require("../../../mongoConfigTesting");

const request = require("supertest");
const express = require("express");
const Offer = require("../../../models/Offer");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", offerController.getOffers);
app.get("/:id/matches", offerController.getMatches);
app.get("/:id/offers", offerController.getOffersOfUser);

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
	var user1;
	var user2;
	var user3;
	var user4;

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
		user1 = testOffers.user1;
		user2 = testOffers.user2;
		user3 = testOffers.user3;
		user4 = testOffers.user4;

		testOffer1 = testOffers.testOffer1;
		testOffer2 = testOffers.testOffer2;
		testOffer3 = testOffers.testOffer3;
		testOffer4 = testOffers.testOffer4;
		testOffer5 = testOffers.testOffer5;
		testOffer6 = testOffers.testOffer6;
		testOffer7 = testOffers.testOffer7;
		testOffer8 = testOffers.testOffer8;
		testOffer9 = testOffers.testOffer9;

		allUsers = [user1, user2, user3, user4];

		allOffers = [
			testOffer9,
			testOffer8,
			testOffer7,
			testOffer6,
			testOffer5,
			testOffer4,
			testOffer3,
			testOffer2,
			testOffer1,
		];

		allUsers.forEach(async (user) => {
			try {
				await user.save();
			} catch (err) {
			} finally {
				return;
			}
		});
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
		await mongoConfigTesting.endMongoConnection();
	});

	describe("get offer test", () => {
		it("could get all offers and have the right fields", (done) => {
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

						expect(data[0]["user"]["username"]).to.eql("bob3");
						expect(data[0]["user"]["password"]).to.not.be.ok;

						expect(data[4]["user"]["username"]).to.eql("bob2");
						expect(data[4]["user"]["password"]).to.not.be.ok;

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
							expectDataToEqual(data, [testOffer4, testOffer1]);
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
								testOffer9,
								testOffer7,
								testOffer5,
								testOffer3,
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
									testOffer8,
									testOffer6,
									testOffer4,
									testOffer2,
									testOffer1,
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
								testOffer8,
								testOffer6,
								testOffer2,
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
								testOffer9,
								testOffer8,
								testOffer7,
								testOffer6,
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
									testOffer3,
									testOffer2,
									testOffer1,
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
							testOffer9,
							testOffer8,
							testOffer7,
							testOffer6,
							testOffer5,
							testOffer4,
							testOffer3,

							testOffer2,
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
						user: new mongoose.Types.ObjectId(),
						additionalInformation:
							"contact me at my Instagram @whatever",
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
						user: new mongoose.Types.ObjectId(),
						additionalInformation:
							"contact me at my Instagram @whatever",
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
						user: new mongoose.Types.ObjectId(),
						additionalInformation:
							"contact me at my Instagram @whatever",
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
						user: new mongoose.Types.ObjectId(),
						additionalInformation:
							"contact me at my Instagram @whatever",
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

	describe("get offers of user test", () => {
		it("could get all offers of a given user", (done) => {
			request(app)
				.get("/" + user2.id + "/offers")
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) {
						return done(err);
					} else {
						var data = JSON.parse(response["text"]);

						expectDataToEqual(data, [
							testOffer8,
							testOffer5,
							testOffer2,
						]);

						done();
					}
				});
		});
	});
});
