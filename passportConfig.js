var dayjs = require("dayjs");

var passport = require("passport");
const passportJWT = require("passport-jwt");
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

			User.findOne({ _id: jwtPayload.id }, (err, user) => {
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
