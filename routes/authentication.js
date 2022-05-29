var express = require("express");
var router = express.Router();

var passport = require("passport");

var authenticationController = require("../controllers/authenticationController/autheticationController");

router.get(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res, next) => {
		return res.json({
			user: { _id: req.user._id, username: req.user.username },
		});
	}
);
router.post("/sign-up", authenticationController.signUpAndLogIn);
router.post("/log-in", authenticationController.logIn);
router.get("/:username", authenticationController.checkExistence);

module.exports = router;
