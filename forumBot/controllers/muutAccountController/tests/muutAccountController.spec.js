const { expect } = require("chai");
require("dotenv").config();

var muutAccountController = require("../muutAccountController");
var mongoConfigTesting = require("../../../../mongoConfigTesting");
var testData = require("./testData");

const request = require("supertest");
const express = require("express");
const dayjs = require("dayjs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/users/:id/muut-account", muutAccountController.updateMuutAccount);
app.get("/users/:id/muut-account", muutAccountController.getMuutAccount);

app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.json({ error: { message: err.message } });
});

describe("muut account controller test", () => {
	var muutAccount1;
	var muutAccount2;
	var muutAccount3;

	var user1 = testData.user1;
	var user2 = testData.user2;
	var user3 = testData.user3;
	var user4 = testData.user4;

	before(async () => {
		await mongoConfigTesting.initializeMongoServer();

		user1 = testData.user1;
		user2 = testData.user2;
		user3 = testData.user3;
		user4 = testData.user4;

		var allUsers = [user1, user2, user3, user4];
		allUsers.forEach(async (user) => {
			await user.save();
		});
	});

	after(async () => {
		await mongoConfigTesting.endMongoConnection();
	});

	describe("update muut account test", () => {
		it("could update when username or password is not provided in the body", (done) => {
			request(app)
				.post("/users/" + user1.id + "/muut-account")
				.send({})
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) {
						done(err);
					}

					var data = JSON.parse(response["text"]);

					expect(data["username"]).to.equal("RoomSwitchButler");
					expect(data["password"]).to.equal(process.env.BOT_PASSWORD);
					expect(data["user"]).to.equal(user1.id);

					next();
				});

			var next = () => {
				request(app)
					.post("/users/" + user1.id + "/muut-account")
					.send({ username: "bobberson" })
					.expect("Content-Type", /json/)
					.expect(200)
					.end((err, response) => {
						if (err) {
							done(err);
						}

						var data = JSON.parse(response["text"]);

						expect(data["username"]).to.equal("RoomSwitchButler");
						expect(data["password"]).to.equal(
							process.env.BOT_PASSWORD
						);
						expect(data["user"]).to.equal(user1.id);

						next1();
					});
			};

			var next1 = () => {
				request(app)
					.post("/users/" + user1.id + "/muut-account")
					.send({ username: "bobberson" })
					.expect("Content-Type", /json/)
					.expect(200)
					.end((err, response) => {
						if (err) {
							done(err);
						}

						var data = JSON.parse(response["text"]);

						expect(data["username"]).to.equal("RoomSwitchButler");
						expect(data["password"]).to.equal(
							process.env.BOT_PASSWORD
						);
						expect(data["user"]).to.equal(user1.id);

						next2();
					});
			};

			var next2 = () => {
				request(app)
					.post("/users/" + user1.id + "/muut-account")
					.send({ username: "bobberson" })
					.expect("Content-Type", /json/)
					.expect(200)
					.end((err, response) => {
						if (err) {
							done(err);
						}

						var data = JSON.parse(response["text"]);

						expect(data["username"]).to.equal("RoomSwitchButler");
						expect(data["password"]).to.equal(
							process.env.BOT_PASSWORD
						);
						expect(data["user"]).to.equal(user1.id);

						done();
					});
			};
		});

		it("could update properly when both password and username is provided", (done) => {
			request(app)
				.post("/users/" + user3.id + "/muut-account")
				.send({ username: "bobberson", password: "hahaha" })
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) {
						done(err);
					}

					var data = JSON.parse(response["text"]);

					expect(data["username"]).to.equal("bobberson");
					expect(data["password"]).to.equal("hahaha");
					expect(data["user"]).to.equal(user3.id);

					done();
				});
		});

		it("could change existing future muut account", (done) => {
			request(app)
				.post("/users/" + user3.id + "/muut-account")
				.send({})
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) {
						done(err);
					}

					var data = JSON.parse(response["text"]);

					if (data["error"]) {
						return done(data["error"]);
					}

					expect(data["username"]).to.equal("RoomSwitchButler");

					expect(data["password"]).to.equal(process.env.BOT_PASSWORD);

					request(app)
						.get("/users/" + user3.id + "/muut-account")
						.expect("Content-Type", /json/)
						.expect(200)
						.end((err, response) => {
							if (err) {
								return done(err);
							}
							var data = JSON.parse(response["text"]);

							if (data["error"]) {
								return done(data["error"]);
							}

							expect(data["username"]).to.equal(
								"RoomSwitchButler"
							);

							expect(data["password"]).to.equal(
								process.env.BOT_PASSWORD
							);

							done();
						});
				});
		});
	});
});
