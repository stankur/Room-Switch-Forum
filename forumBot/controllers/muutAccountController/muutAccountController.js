var MuutAccount = require("../../models/MuutAccount");

var updateMuutAccount = (req, res, next) => {
	var user = req.params.id;

	var username = undefined;
	var password = undefined;

	if (req.body.username && req.body.password) {
		username = req.body.username;
		password = req.body.password;
	} else {
		username = "RoomSwitchButler";
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

			return res.json(doc);
		});
};

var findMuutAccount = (req, res, next) => {
	var userId = req.params.id;

	MuutAccount.find({ user: userId })
		.lean()
		.exec((err, foundMuutAccount) => {
			if (err) {
				return next(err);
			}

			if (!foundMuutAccount) {
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

			return res.json(foundMuutAccount[0]);
		});
};

module.exports = { updateMuutAccount, findMuutAccount };
