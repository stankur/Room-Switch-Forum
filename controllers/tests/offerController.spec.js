var mongoose = require("mongoose");

var Offer = require("../../models/Offer");
var offerController = require("../offerController");

var mongoConfigTesting = require("../../mongoConfigTesting");

const request = require("supertest");
const express = require("express");
const app = express();

const { expect } = require("chai");

app.use(express.urlencoded({ extended: false }));
app.get("/", offerController.getOffers);
app.get("/:id/matches", offerController.getMatches);

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

		testOffer1 = new Offer({
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

		testOffer2 = new Offer({
			numberOfPeople: 1,
			roomsWanted: 1,
			rooms: [
				{
					residenceArea: "St. John's College",
					generalInfo: {
						session: "Year Round",
					},
					roomInfo: {
						room: "Single Traditional Room",
						floor: 1,
						washroom: "Private",
					},
					eligibilityInfo: {
						allowedGender: "Any",
					},
				},
			],
		});

		testOffer3 = new Offer({
			numberOfPeople: 2,
			roomsWanted: 2,
			rooms: [
				{
					residenceArea: "Totem Park",
					generalInfo: {
						session: "Winter Session",
					},
					roomInfo: {
						room: "Shared Room",
						floor: 1,
						washroom: "Communal",
						building: "Nootka House",
					},
					eligibilityInfo: {
						allowedGender: "Male",
					},
				},
			],
			preference: [
				{
					residenceArea: [
						"Orchard Commons",
						"Totem Park",
						"Exchange",
						"Fraser Hall",
					],
					roomInfo: {
						floor: {
							spec: "Interval",
							criteria: [1, 9],
						},
					},
				},
			],
		});

		testOffer4 = new Offer({
			numberOfPeople: 1,
			roomsWanted: 1,
			rooms: [
				{
					residenceArea: "Exchange",
					generalInfo: {
						session: "Year Round",
					},
					roomInfo: {
						room: "Studio Suite",
						floor: 10,
						washroom: "Private",
					},
					eligibilityInfo: {
						allowedGender: "Male",
					},
				},
			],
		});
		testOffer5 = new Offer({
			numberOfPeople: 2,
			roomsWanted: 1,
			rooms: [
				{
					residenceArea: "Fraser Hall",
					generalInfo: {
						session: "Year Round",
					},
					roomInfo: {
						room: "Six Bedroom Suite",
						floor: 8,
						washroom: "Private",
					},
					eligibilityInfo: {
						allowedGender: "Female",
					},
				},
			],
		});
		testOffer6 = new Offer({
			numberOfPeople: 1,
			roomsWanted: 1,
			rooms: [
				{
					residenceArea: "Marine Drive",
					generalInfo: {
						session: "Year Round",
					},
					roomInfo: {
						room: "Two Bedroom Suite",
						floor: 4,
						washroom: "Private",
						building: "Marine Drive 6",
					},
					eligibilityInfo: {
						allowedGender: "Female",
					},
				},
			],
		});
		testOffer7 = new Offer({
			numberOfPeople: 2,
			roomsWanted: 1,
			rooms: [
				{
					residenceArea: "Ritsumeikan-UBC House",
					generalInfo: {
						session: "Winter Session",
					},
					roomInfo: {
						room: "Four Bedroom Suite",
						floor: 14,
						washroom: "Private",
					},
					eligibilityInfo: {
						allowedGender: "Any",
					},
				},
			],
		});
		testOffer8 = new Offer({
			numberOfPeople: 1,
			roomsWanted: 1,
			rooms: [
				{
					residenceArea: "Thunderbird",
					generalInfo: {
						session: "Year Round",
					},
					roomInfo: {
						room: "Studio Suite",
						floor: 3,
						washroom: "Private",
						building: "1000 Block - Cassiar",
					},
					eligibilityInfo: {
						allowedGender: "Any",
					},
				},
			],
		});
		testOffer9 = new Offer({
			numberOfPeople: 2,
			roomsWanted: 1,
			rooms: [
				{
					residenceArea: "Acadia Park",
					generalInfo: {
						session: "Year Round",
					},
					roomInfo: {
						room: "One Bedroom Suite",
						floor: 7,
						washroom: "Private",
						building: "Presidents Row",
					},
					eligibilityInfo: {
						allowedGender: "Any",
					},
				},
			],
		});

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
	});

	describe("get matches test", () => {
		it("could get all offers of default preference", (done) => {
			console.log("id given: " + testOffer1.id);
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
			console.log("id given: " + testOffer3.id);
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
});
