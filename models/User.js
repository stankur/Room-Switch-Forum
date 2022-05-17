var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: {
		type: String,
		validate: {
			validator: function (value) {
				return value.length >= 1;
			},
		},
	},
	password: String,
});

module.exports = mongoose.model("User", UserSchema);
