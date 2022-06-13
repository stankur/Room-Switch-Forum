var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const {
	isPositiveInteger,
} = require("../../models/schemaComponents/validators/floorValidator");

var FuturePostSchema = new Schema({
	title: {
		type: String,
		maxlength: 80,
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	nextPost: {
		type: Date,
		default: () => Date.now(),
	},
	hourInterval: {
		type: Number,
		required: true,
		validate: {
			validator: isPositiveInteger,
		},
	},
	nextTimesSent: {
		type: Number,
		default: 1,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

module.exports = mongoose.model("FuturePost", FuturePostSchema);
