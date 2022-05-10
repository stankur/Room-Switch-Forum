var mongoose = require("mongoose");

var Offer = require("../../models/Offer");
var offerController = require("../offerController");

var mongoConfigTesting = require("../../mongoConfigTesting");

const request = require("supertest");
const express = require("express");
const app = express();

const { expect } = require("chai");

app.use(express.urlencoded({ extended: false }));
app.get("/", offerController.getOffer);

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
						expect(data.length).to.equal(9);

						var ids = data.map((offer) => {
							return offer["_id"];
						});

						var expectedIds = allOffers.map((offer) => {
							return offer.id;
						});

						expect(ids).to.eql(expectedIds);
						done();
					}
				});
		});

		describe("filter test", () => {
			it("could perform one includes type of filter", (done) => {
				request(app)
					.get("/")
					.query({
						filter: '{"rooms" : { "type" : "Includes", "criteria": { "residenceArea" : ["Orchard Commons", "Exchange"]}}}',
					})
					.expect("Content-Type", /json/)
					.expect(200)
					.end((err, response) => {
						if (err) {
							done(new Error(err));
						} else {
							var data = JSON.parse(response["text"]);
							console.log(data);
							expect(data.length).to.equal(2);

							var ids = data.map((offer) => {
								return offer["_id"];
							});

							var expectedIds = [testOffer1, testOffer4].map(
								(offer) => {
									return offer.id;
								}
							);

							expect(ids).to.eql(expectedIds);
							done();
						}
					});
			});

			it("could perform one interval type of filter", (done) => {
				request(app)
					.get("/")
					.query({
						filter: '{"numberOfPeople": { "type": "Interval", "criteria" : [2, "Infinity"] }}',
					})
					.expect("Content-Type", /json/)
					.expect(200)
					.end((err, response) => {
						if (err) {
							done(new Error(err));
						} else {
							var data = JSON.parse(response["text"]);
							console.log(data);
							expect(data.length).to.equal(4);

							var ids = data.map((offer) => {
								return offer["_id"];
							});

							var expectedIds = [
								testOffer3,
								testOffer5,
								testOffer7,
								testOffer9,
							].map((offer) => {
								return offer.id;
							});

							expect(ids).to.eql(expectedIds);
							next();
						}
					});

				var next = () => {
					request(app)
						.get("/")
						.query({
							filter: '{"numberOfPeople" : { "type": "Interval", "criteria" : [1, 1] }}',
						})
						.expect("Content-Type", /json/)
						.expect(200)
						.end((err, response) => {
							if (err) {
								done(new Error(err));
							} else {
								var data = JSON.parse(response["text"]);
								console.log(data);
								expect(data.length).to.equal(5);

								var ids = data.map((offer) => {
									return offer["_id"];
								});

								var expectedIds = [
									testOffer1,
									testOffer2,
									testOffer4,
									testOffer6,
									testOffer8,
								].map((offer) => {
									return offer.id;
								});

								expect(ids).to.eql(expectedIds);
								done();
							}
						});
				};
			});

			it("could perform normal type of filter (the filter of acceptable values)", (done) => {
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
							console.log(data);
							expect(data.length).to.equal(1);

							var ids = data.map((offer) => {
								return offer["_id"];
							});

							var expectedIds = [testOffer3].map((offer) => {
								return offer.id;
							});

							expect(ids).to.eql(expectedIds);
							done();
						}
					});
			});

			it("could perform combiated filters", (done) => {
				request(app)
					.get("/")
					.query({
						filter: '{ "numberOfPeople": 1, "rooms": {"type": "Includes", "criteria": {"roomInfo": {"washroom": "Private", "floor": {"type" : "Interval", "criteria" : [1, 5]}}}}}',
					})
					.expect("Content-Type", /json/)
					.expect(200)
					.end((err, response) => {
						if (err) {
							done(err);
						} else {
							var data = JSON.parse(response["text"]);
							expect(data.length).to.equal(3);

							var ids = data.map((offer) => {
								return offer["_id"];
							});

							var expectedIds = [
								testOffer2,
								testOffer6,
								testOffer8,
							].map((offer) => {
								return offer.id;
							});

							expect(ids).to.eql(expectedIds);
							done();
						}
					});
			});
		});
	});
});
