var User = require("../../../../models/User");

var user1 = new User({
	username: "bob1",
	password: "bob1",
});

var user2 = new User({
	username: "bob2",
	password: "bob2",
});

var user3 = new User({
	username: "bob3",
	password: "bob3",
});

var user4 = new User({
	username: "bob4",
	password: "bob4",
});

module.exports = {
	user1,
	user2,
	user3,
	user4,
};