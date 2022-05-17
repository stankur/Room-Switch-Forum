require("dotenv").config();
var User = require("../../models/User");
var bcrypt = require("bcryptjs");
var jsonWebToken = require("jsonwebtoken");

var checkExistence = (req, res, next) => {
	var username = req.params.username;

	User.findOne({ username: username })
		.lean()
		.exec((err, foundUser) => {
			if (err) {
				return next(err);
			}

			if (!foundUser) {
				return res.json({
					exists: false,
				});
			}

			return res.json({
				exists: true,
			});
		});
};

var signUp = (req, res, next) => {
	var username = req.body.username;
	var password = req.body.password;

	User.findOne({ username: username })
		.lean()
		.exec((err, foundUser) => {
			if (err) {
				return next(err);
			}

			if (foundUser) {
				return next(
					new Error("user with given username already exists")
				);
			}

			bcrypt.hash(
				password,
				parseInt(process.env.SALT),
				(err, hashedPassword) => {
					if (err) {
						return next(err);
					}

					var newUser = new User({
						username: username,
						password: hashedPassword,
					});

					newUser.save((err, newUser) => {
						if (err) {
							return next(err);
						}

						return res.json(newUser.toObject());
					});
				}
			);
		});
};

var logIn = (req, res, next) => {
	var username = req.body.username;
	var password = req.body.password;

	User.findOne({ username: username })
		.lean()
		.exec((err, foundUser) => {
			if (err) {
				return next(err);
			}

			if (!foundUser) {
				return next(new Error("wrong username"));
			}

			bcrypt
				.compare(password, foundUser.password)
				.then((isPasswordCorrect) => {
					if (!isPasswordCorrect) {
						return next(new Error("password incorrect"));
					}

					var jwtPayload = {
						id: foundUser._id,
						iat: Date.now(),
					};

					var signedToken =
						"Bearer " +
						jsonWebToken.sign(jwtPayload, process.env.SECRET);

					return res.json({ token: signedToken });
				})
				.catch((err) => {
					return next(err);
				});
		});
};

module.exports = {
	checkExistence,
	signUp,
	logIn,
};
