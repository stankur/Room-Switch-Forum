var express = require("express");
var router = express.Router();

var residencesModule = require("../staticInformation/residences");
var offerController = require("../controllers/offerController/offerController");

router.get("/offers", offerController.getOffers);
router.get("/offers/:id", offerController.getOffer);
router.get("/offers/:id/matches", offerController.getMatches);

router.post("/offers", offerController.createOffer);

router.delete("/offers/:id", offerController.deleteOffer);

router.get("/residences", (res, req, next) => {
	return res.json(residencesModule.residences);
});

module.exports = router;
