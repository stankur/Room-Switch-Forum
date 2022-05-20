var express = require("express");
var router = express.Router();

var authenticationController = require("../controllers/authenticationController/autheticationController");

router.get("/:username", authenticationController.checkExistence);

router.post("/sign-up", authenticationController.signUp);
router.post("/log-in", authenticationController.logIn);

module.exports = router;