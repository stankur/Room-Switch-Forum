var dayjs = require("dayjs");
require("dotenv").config();

var passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("./models/User");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.SECRET,
		},
		(jwtPayload, done) => {
			if (dayjs().isAfter(jwtPayload.exp, "day")) {
				return done(new Error("token is expired"), false);
			}

			User.findById({ _id: jwtPayload.id })
				.lean()
				.exec((err, user) => {
					if (err) {
						return done(err, false);
					}

					if (user) {
						return done(null, user);
					} else {
						return done(null, false);
					}
				});
		}
	)
);

module.exports = passport;
