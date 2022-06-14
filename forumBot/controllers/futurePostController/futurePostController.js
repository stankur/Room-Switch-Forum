var FuturePost = require("../../models/FuturePost");
var dayjs = require("dayjs");

var generateNextPost = (userDefinedNextPost) => {
	if (userDefinedNextPost && dayjs(userDefinedNextPost).isAfter(dayjs())) {
		return dayjs(userDefinedNextPost).toDate();
	}
};

var createFuturePost = (req, res, next) => {
	try {
		req.body.title;
		req.body.body;
		req.body.hourInterval;
	} catch (err) {
		return next(err);
	}

	var user = req.params.id;

	FuturePost.findOneAndUpdate(
		{ user },
		(() => {
			var nextPost = generateNextPost(req.body.nextPost);

			var title = req.body.title;
			var body = req.body.body;

			var hourInterval = req.body.hourInterval;

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
