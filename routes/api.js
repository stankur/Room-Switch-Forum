var express = require("express");
var router = express.Router();

var offerController = require("../controllers/offerController");

router.get("/offers", offerController.getOffers);

module.exports = router;
