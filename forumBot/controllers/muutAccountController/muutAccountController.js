var MuutAccount = require("../../models/MuutAccount");

var updateMuutAccount = (req, res, next) => {
	var user = req.params.id;

	var username = undefined;
	var password = undefined;

	if (req.body.username && req.body.password) {
		username = req.body.username;
		password = req.body.password;
	} else {
		username = "testeruser";
		password = process.env.BOT_PASSWORD;
	}

	MuutAccount.findOneAndUpdate(
		{ user },
		{
			username,
			password,
			user,
		},
		{ upsert: true, returnOriginal: false }
	)
		.lean()
		.exec((err, doc) => {
			if (err) {
				return next(err);
			}

			//this is so that if the user uses our default account in the forum,
			// our password don't get exposed
			delete doc["password"];

			return res.json(doc);
		});
};

var findMuutAccount = (req, res, next) => {
	var userId = req.params.id;

	return MuutAccount.find({ user: userId }, "-password")
		.lean()
		.exec((err, foundMuutAccount) => {
			if (err) {
				return next(err);
			}

			if (foundMuutAccount.length === 0) {
				return next(
					new Error(
						"the user with given user id doesn't have a registered muut account"
					)
				);
			}

			if (foundMuutAccount.length > 1) {
				return next(
					new Error(
						"more than one muut accounts exist for the given user"
					)
				);
			}

			req.muutAccount = foundMuutAccount[0];

			return next();
		});
};

var sendMuutAccount = (req, res, next) => {
	return res.json(req.muutAccount);
};

var getMuutAccount = [findMuutAccount, sendMuutAccount];

module.exports = { updateMuutAccount, findMuutAccount, getMuutAccount };
