var FuturePost = require("../../models/FuturePost");
var dayjs = require("dayjs");

var generateNextPost = (userDefinedNextPost) => {
	if (userDefinedNextPost && dayjs(userDefinedNextPost).isAfter(dayjs())) {
		return dayjs(userDefinedNextPost).toDate();
	}
};

var createFuturePost = (req, res, next) => {
	var user = req.params.id;

	FuturePost.findOneAndUpdate(
		{ user },
		(() => {
			var nextPost = generateNextPost(req.body.nextPost);
			var title;
			var body;
			var hourInterval;

			try {
				if (
					!req.body.title ||
					!req.body.body ||
					!req.body.hourInterval
				) {
					throw new Error(
						"one of the title, body, or hour interval is missing"
					);
				}
				title = req.body.title;
				body = req.body.body;
				hourInterval = req.body.hourInterval;
			} catch (err) {
				return next(err);
			}

			if (nextPost) {
				return {
					title,
					body,
					nextPost,
					hourInterval,
					user,
				};
			} else {
				return {
					title,
					body,
					hourInterval,
					user,
				};
			}
		})(),
		{ upsert: true, returnOriginal: false },
		(err, newPost) => {
			if (err) {
				return next(err);
			}

			return res.json(newPost.toObject());
		}
	);
};

module.exports = {
	createFuturePost,
};
