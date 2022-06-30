var muutAccountController = require("../controllers/muutAccountController/muutAccountController");
var futurePostController = require("../controllers/futurePostController/futurePostController");
var express = require("express");
var router = express.Router();

var EnsureParamsUserIsSelf = (req, res, next) => {
	try {
		if (req.params.id === req.user._id.toString()) {
			return next();
		}

		return next(
			new Error(
				"user in the request params does not match with requester"
			)
		);
	} catch (err) {
		return next(err);
	}
};

router.get("/", (req, res) => {
	return res.json({ title: "forum bot" });
});

router.get("/users/:id/muut-account", [
	EnsureParamsUserIsSelf,
	muutAccountController.getMuutAccount,
]);

router.post("/users/:id/muut-account", [
	EnsureParamsUserIsSelf,
	muutAccountController.updateMuutAccount,
]);

router.get("/users/:id/future-posts", [
	EnsureParamsUserIsSelf,
	futurePostController.getFuturePost,
]);

router.post("/users/:id/future-posts", [
	EnsureParamsUserIsSelf,
	muutAccountController.findMuutAccount,
	futurePostController.createFuturePost,
]);

module.exports = router;
