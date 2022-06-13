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

	var title = req.body.title;
	var body = req.body.body;

	var nextPost = generateNextPost(req.body.nextPost);

	var hourInterval = req.body.hourInterval;
	var user = req.params.id;

	var newFuturePost;

	console.log("next post: " + nextPost);

	if (nextPost) {
		newFuturePost = new FuturePost({
			title,
			body,
			nextPost,
			hourInterval,
			user,
		});
	} else {
		newFuturePost = new FuturePost({
			title,
			body,
			hourInterval,
			user,
		});
	}

	console.log(
		"next post after handled by mongoose: " + newFuturePost.nextPost
	);
	newFuturePost.save((err, newPost) => {
		if (err) {
			return next(err);
		}

		return res.json(newPost.toObject());
	});
};

module.exports = {
	createFuturePost,
};
