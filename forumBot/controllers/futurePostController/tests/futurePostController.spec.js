var mongoose = require("mongoose");
const { expect } = require("chai");

var futurePostController = require("../futurePostController");
var FuturePost = require("../../../models/FuturePost");
var mongoConfigTesting = require("../../../../mongoConfigTesting");
var testData = require("./testData");

const request = require("supertest");
const express = require("express");
const dayjs = require("dayjs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/users/:id/future-posts", futurePostController.createFuturePost);

app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.json({ error: { message: err.message } });
});

describe("future post controller test", () => {
	var user1;
	var user2;
	var user3;
	var user4;

    var tooEarlyFuturePostId;
    var notSpecifiedFuturePostId;
    var aheadFuturePostId;

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

	describe("create offer test", () => {
		describe("next post time cases test", () => {
			it("works when next post time is too early", (done) => {
				request(app)
					.post("/users/" + user1.id + "/future-posts")
					.send({
						title: "Subletting Marine Drive!",
						body: "Please contact me at email@hotmail",
						hourInterval: 2,
						nextPost: dayjs().subtract(1, "day").valueOf(),
					})
					.expect("Content-Type", /json/)
					.expect(200)
					.end((err, response) => {
						if (err) {
							return done(err);
						}
						var data = JSON.parse(response["text"]);

						expect(data["title"]).to.equal(
							"Subletting Marine Drive!"
						);
						expect(data["body"]).to.equal(
							"Please contact me at email@hotmail"
						);
						expect(dayjs(data["nextPost"]).isSame(dayjs(), "hour"))
							.to.be.true;

						expect(Number.parseInt(data["hourInterval"])).to.equal(
							2
						);
						expect(Number.parseInt(data["nextTimesSent"])).to.equal(
							1
						);

						expect(data["user"]).to.equal(user1.id);
                        tooEarlyFuturePostId = data["_id"];

						done();
					});
			});
			it("works when next post time is not provided", (done) => {
				request(app)
					.post("/users/" + user2.id + "/future-posts")
					.send({
						title: "Subletting Marine Drive!",
						body: "Please contact me at email@hotmail",
						hourInterval: 2,
					})
					.expect("Content-Type", /json/)
					.expect(200)
					.end((err, response) => {
						if (err) {
							return done(err);
						}
						var data = JSON.parse(response["text"]);

						expect(data["title"]).to.equal(
							"Subletting Marine Drive!"
						);
						expect(data["body"]).to.equal(
							"Please contact me at email@hotmail"
						);
						expect(
							dayjs(data["nextPost"]).isSame(dayjs(), "minute")
						).to.be.true;
						expect(Number.parseInt(data["hourInterval"])).to.equal(
							2
						);
						expect(Number.parseInt(data["nextTimesSent"])).to.equal(
							1
						);

						expect(data["user"]).to.equal(user2.id);
						notSpecifiedFuturePostId = data["_id"];

						done();
					});
			});

			it("works when next post time is ahead in the future", (done) => {
				request(app)
					.post("/users/" + user3.id + "/future-posts")
					.send({
						title: "Subletting Marine Drive!",
						body: "Please contact me at email@hotmail",
						hourInterval: 2,
						nextPost: dayjs().add(1, "day").toDate(),
					})
					.expect("Content-Type", /json/)
					.expect(200)
					.end((err, response) => {
						if (err) {
							return done(err);
						}
						var data = JSON.parse(response["text"]);

						expect(data["title"]).to.equal(
							"Subletting Marine Drive!"
						);
						expect(data["body"]).to.equal(
							"Please contact me at email@hotmail"
						);
						expect(
							dayjs(data["nextPost"]).isSame(
								dayjs().add(1, "day"),
								"hour"
							)
						).to.be.true;
						expect(Number.parseInt(data["hourInterval"])).to.equal(
							2
						);
						expect(Number.parseInt(data["nextTimesSent"])).to.equal(
							1
						);

						expect(data["user"]).to.equal(user3.id);
                        aheadFuturePostId = data["_id"];

						done();
					});
			});
		});
	});
});
