var mongoose = require("mongoose");

const { expect } = require("chai");

var authenticationController = require("../autheticationController");

const request = require("supertest");
const express = require("express");
const User = require("../../../models/User");

var mongoConfigTesting = require("../../../mongoConfigTesting");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/:username", authenticationController.checkExistence);
app.post("/sign-up", authenticationController.signUp);
app.post("/log-in", authenticationController.logIn);

describe("authentication controller test", () => {
	var testUser1;
	var testUser2;
	var testUser3;
	var testUser4;
	var testUser5;
	var testUser6;

	var allUsers;

	before(async () => {
		await mongoConfigTesting.initializeMongoServer();

		testUser1 = new User({
			username: "bob1",
			password: "bob1",
		});

		testUser2 = new User({
			username: "bob2",
			password: "bob2",
		});

		testUser3 = new User({
			username: "bob3",
			password: "bob3",
		});

		testUser4 = new User({
			username: "bob4",
			password: "bob4",
		});

		testUser5 = new User({
			username: "bob5",
			password: "bob5",
		});

		testUser6 = new User({
			username: "bob6",
			password: "bob6",
		});

		allUsers = [
			testUser1,
			testUser2,
			testUser3,
			testUser4,
			testUser5,
			testUser6,
		];

		allUsers.forEach(async (testUser) => {
			try {
				await testUser.save();
			} catch (err) {
			} finally {
				return;
			}
		});
	});

	after(async () => {
		await mongoConfigTesting.endMongoConnection();
		console.log("connection closed");
	});

	describe("check existence test", () => {
		it("could return correct JSON on existing username", (done) => {
			request(app)
				.get("/bob1")
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) {
						done(new Error(err));
					} else {
						var data = JSON.parse(response["text"]);
						expect(data).to.eql({
							exists: true,
						});
						done();
					}
				});
		});

		it("could return correct JSON on non existing username", (done) => {
			request(app)
				.get("/bob")
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) {
						done(new Error(err));
					} else {
						var data = JSON.parse(response["text"]);
						expect(data).to.eql({
							exists: false,
						});
						done();
					}
				});
		});
	});

	describe("sign up test", () => {
		it("could reject new user when username exists", (done) => {
			request(app)
				.post("/sign-up")
				.send({
					username: "bob1",
					password: "bob12345678",
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err) => {
					if (err) {
						done();
					} else {
						done(
							new Error(
								"expected error to be thrown since username must be unique"
							)
						);
					}
				});
		});

		it("could sign up a new user when username is new", (done) => {
			request(app)
				.post("/sign-up")
				.send({
					username: "stankur",
					password: "bob12345678",
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) {
						done(new Error(err));
					} else {
						var data = JSON.parse(response["text"]);

						expect(data["username"]).to.equal("stankur");
						done();
					}
				});
		});
	});

	describe("log in test", () => {
		it("doesn't log in when username doesn't exist", (done) => {
			request(app)
				.post("/log-in")
				.send({
					username: "kumal",
					password: "bob12345678",
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) {
						done();
					} else {
						done(
							new Error(
								"expected error to be thrown since username doesn't exist"
							)
						);
					}
				});
		});

		it("logs in when right password is provided", (done) => {
			request(app)
				.post("/log-in")
				.send({
					username: "stankur",
					password: "bob12345678",
				})
				.expect("Content-Type", /json/)
				.expect(200)
				.end((err, response) => {
					if (err) {
						done(err);
					} else {
						var data = JSON.parse(response["text"]);

						console.log(data["token"]);
						expect(data["token"]).to.exist;
						done();
					}
				});
		});
	});
});
