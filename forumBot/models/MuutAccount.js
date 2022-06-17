require("dotenv").config();

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MuutAccountSchema = new Schema({
	username: {
		type: String,
		default: "testeruser",
	},
	password: {
		type: String,
		minlength: 5,
		default: process.env.BOT_PASSWORD,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

module.exports = mongoose.model("MuutAccount", MuutAccountSchema);