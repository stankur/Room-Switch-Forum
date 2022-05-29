var express = require("express");
var router = express.Router();

var passport = require("passport");

var residencesModule = require("../staticInformation/residences");
var offerController = require("../controllers/offerController/offerController");

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

var EnsureOfferUserIsSelf = (req, res, next) => {
	try {
		if (req.body.offer.user === req.user._id.toString()) {
			return next();
		}

		return next(
			new Error("user in the request offer does not match with requester")
		);
	} catch (err) {
		next(err);
	}
};

router.get("/offers", offerController.getOffers);
router.get("/offers/:id", offerController.getOffer);
router.get("/offers/:id/matches", offerController.getMatches);

router.post(
	"/offers",
	passport.authenticate("jwt", { session: false }),
	EnsureOfferUserIsSelf,
	offerController.createOffer
);

router.delete(
	"/offers/:id",
	passport.authenticate("jwt", { session: false }),
	offerController.deleteOffer
);

router.get("/residences", (res, req, next) => {
	return res.json(residencesModule.residences);
});

router.get("/users/:id/offers", offerController.getOffersOfUser);

module.exports = router;
