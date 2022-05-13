var express = require("express");
var router = express.Router();

var offerController = require("../controllers/offerController");

router.get("/offers", offerController.getOffers);
router.get("/offers/:id", offerController.getOffer);
router.get("/offers/:id/matches", offerController.getMatches);

router.post("/offers", offerController.createOffer);

router.delete("/offers/:id", offerController.deleteOffer);
module.exports = router;
