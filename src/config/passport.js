import passport from "passport-jwt";

const opts = {
  jwtFromRequest: passport.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_KEY,
};

export const jwtStrategy = new passport.Strategy(opts, (jwt_payload, done) =>
  done(null, jwt_payload)
);
